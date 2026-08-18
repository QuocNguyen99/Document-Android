# Recyclerview Adapter

## Cập nhật một phần

Mục đích của nhóm phương pháp `notifyItemChanged` / `notifyItemRangeChanged` rất đơn giản:
**họ cho Adapter biết về những thay đổi để nó có thể gắn lại các vật phẩm.**


Tuy nhiên, các phương thức này cũng có một số tình trạng quá tải đặc biệt liên quan đến tham số payload:

- `notifyItemChanged(position: Int, payload: Any?)`
- `notifyItemRangeChanged(positionStart: Int, itemCount: Int, payload: Any?)`

**payload thay đổi** đóng vai trò như một thông báo mô tả những gì đã thay đổi bên trong một mục. Khi `payload == null`, bản cập nhật đầy đủ sẽ diễn ra. Vì vậy, ViewHolder cũ được kết hợp với một cái mới, được liên kết mới (giả sử trình hoạt hình mục mặc định đang được sử dụng).

Khi `payload == null`, bản cập nhật đầy đủ sẽ diễn ra. Vì vậy, `ViewHolder` cũ được kết hợp với một cái mới, được ràng buộc mới (giả sử trình hoạt hình mục mặc định đang được sử dụng).

Tuy nhiên, nếu `payload != null`, nó sẽ được chuyển sang phương thức `onBindViewHolder(…, …, payloads: List<Any>)` và trình hoạt ảnh mục mặc định sẽ không thực hiện bất kỳ thao tác nào. Điều này có nghĩa là chúng ta có thể chuyển bất cứ thứ gì ngoại trừ null dưới dạng payload để bỏ qua hoàn toàn **thay đổi hoạt ảnh**.
Và nếu chúng ta áp dụng cách tiếp cận này, các mục sẽ được cập nhật ngay lập tức mà không bị nhấp nháy do hoạt ảnh mờ dần gây ra.


Khi sử dụng `DiffUtil`, điều này có thể đạt được bằng cách ghi đè phương thức `getChangePayload`:

```kotlin
object : DiffUtil.ItemCallback<Transaction>() {
    override fun areItemsTheSame(
        oldItem: Transaction, newItem: Transaction,
    ): Boolean =
        // ...

    override fun areContentsTheSame(
        oldItem: Transaction, newItem: Transaction,
    ): Boolean =
        oldItem == newItem

    override fun getChangePayload( // added
        oldItem: Transaction, newItem: Transaction,
    ): Any? =
        Unit
}
```

Tuy nhiên, mục đích chính của việc thay đổi payload là cung cấp một số thông tin hữu ích cho `onBindViewHolder`.
Phương thức này có hai overload, vì vậy để tận dụng payload, chúng ta cần override overload tương ứng:

```kotlin
override fun onBindViewHolder(holder: TransactionViewHolder, position: Int) {
    // we have to override it because it's abstract…
}

override fun onBindViewHolder(
    holder: TransactionViewHolder, position: Int, payloads: List<Any>,
) {
    // but we're going to use this one in order to receive payloads!
}
```

Điều đó cho chúng ta một danh sách các payload. Nó sẽ trống trong trường hợp cập nhật đầy đủ; nếu không, nó sẽ chứa tất cả các giá trị được truyền cho phương thức `notify` kể từ lần liên kết cuối cùng.

Không giống như `notifyItemChanged`, `getChangePayload` chỉ có thể cung cấp cho bạn một đối tượng payload duy nhất. Nếu bạn trả về collection, danh sách `payloads` sẽ chứa collection này chứ không phải các mục của nó. Hãy xem xét hướng này khi xử lý payload.


## Ví dụ đầy đủ

Hãy tưởng tượng một hệ thống ngân hàng thay thế trong đó một số thuộc tính giao dịch có thể thay đổi trong khi nó đang được xử lý:

- receiver có thể chuyển hướng nó đến đối tác hoặc đại lý của họ,
- số tiền có thể giảm một chút nếu giao dịch được xử lý bên trong một ngân hàng và một quốc gia,
- trạng thái có thể thay đổi từ `PROCESSING` thành `FAILED` hoặc `SUCCESSFUL`.

Do đó, lớp `Transaction` sẽ trông như thế này:

```kotlin
data class Transaction(
    val id: Int,
    val receiver: String,
    val account: String,
    val amount: Long,
    val status: Status,
    val time: Instant,
) {
    enum class Status {
        PROCESSING, SUCCESSFUL, FAILED,
    }
}
```

Để theo dõi những thay đổi về thuộc tính, chúng ta cần liệt kê chúng:

```kotlin
enum class ChangeField {
    RECEIVER, AMOUNT, STATUS,
}
```

Payload sẽ liệt kê tất cả các thuộc tính đã thay đổi:

```kotlin
object : DiffUtil.ItemCallback<Item>() {
    override fun areItemsTheSame(oldItem: Transaction, newItem: Transaction): Boolean =
        oldItem.id == newItem.id

    override fun areContentsTheSame(oldItem: Transaction, newItem: Transaction): Boolean =
        oldItem == newItem

    override fun getChangePayload(oldItem: Transaction, newItem: Transaction): Any? =
        listOfNotNull(
            ChangeField.RECEIVER.takeIf { oldItem.receiver != newItem.receiver },
            ChangeField.AMOUNT.takeIf { oldItem.amount != newItem.amount },
            ChangeField.STATUS.takeIf { oldItem.status != newItem.status },
        )
}
```

Khi đã xong, chúng ta có thể sử dụng mã hiển thị bên dưới để áp dụng các bản cập nhật, bao gồm cả các bản cập nhật một phần khi được yêu cầu:

```kotlin
    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
    }
    override fun onBindViewHolder(
        holder: TransactionViewHolder, position: Int, payloads: List<Any>,
    ) {
        val t = getItem(position)

        // collect all supported payloads
        val changes =
            if (payloads.isEmpty()) emptySet<ChangeField>()
            else EnumSet.noneOf(ChangeField::class.java).also { changes ->
                payloads.forEach { payload ->
                    (payload as? Collection<*>)?.filterIsInstanceTo(changes)
                }
            }

        holder.apply {
            if (changes.isEmpty()) {
                account.text = t.account
            }
            // apply changes if requested or in case of full binding
            if (changes.isEmpty() || ChangeField.RECEIVER in changes) {
                receiver.text = t.receiver
            }
            if (changes.isEmpty() || ChangeField.AMOUNT in changes) {
                amount.text = "$%.2f".format(t.amount / 100f)
            }
            if (changes.isEmpty() || ChangeField.STATUS in changes) {
                status.text = t.status.name
                status.setTextColor(when (t.status) {
                    Item.Transaction.Status.PROCESSING -> Color.DKGRAY
                    Item.Transaction.Status.SUCCESSFUL -> Color.GREEN
                    Item.Transaction.Status.FAILED -> Color.RED
                })
            }
        }
    }
```


**Mục đích chính của máy payload là áp dụng các thay đổi nhanh hơn.**
Điều này rất quan trọng khi xử lý dữ liệu dễ biến động như giá cổ phiếu theo thời gian thực, vốn thay đổi nhiều lần trong một giây.
Tuy nhiên, trong các trường hợp đơn giản hơn, việc chuyển một payload giả (như Đơn vị) là một cách đơn giản để áp dụng các bản cập nhật nhỏ mà không thay đổi hoạt ảnh (như đã giải thích trước đó trong phần này).

## Các loại bộ điều hợp và chế độ xem không đồng nhất

Danh sách động do RecyclerView tạo có thể chứa nhiều loại mục khác nhau và có nhiều cách để điều này có thể hữu ích.

Ví dụ: chúng ta có thể đặt các tiêu đề đơn giản giữa các mục hoặc bao gồm một số chế độ xem hoàn toàn khác nhau trong cùng một danh sách.

Adapter bao gồm khái niệm **loại chế độ xem** cho mục đích này. Nhưng để sử dụng chúng, trước tiên chúng ta cần làm cho dữ liệu của mình **không đồng nhất**.
Hãy sử dụng các giao dịch và ngày làm ví dụ:

Bây giờ chúng ta cần chuyển đổi Adapter để sử dụng `Item` thay vì `Transaction` và `ViewHolder` cơ sở thay vì `TransactionHolder`:


```kotlin
class TransactionsAdapter(transactions: List<Item>) :
    ListAdapter<Item, RecyclerView.ViewHolder>(…) {

    init {
        submitList(transactions)
    }
    /**The purpose of our newly overridden getItemViewType method is to help the Adapter distinguish between these types. 
    We can use any integers we like to represent view types. 
    We'll receive these values later, when new ViewHolders are requested, and determine which one to instantiate:**/
    override fun getItemViewType(position: Int): In t =
        when (getItem(position)) {
            is Item.Day -> 0
            is Item.Transaction -> 1
        }

    override fun onCreateViewHolder(
        parent: ViewGroup, viewType: Int,
    ): RecyclerView.ViewHolder = when (viewType) {
        0 -> object : RecyclerView.ViewHolder(TextView(parent.context)) {}
        1 -> TransactionViewHolder(
            LayoutInflater.from(parent.context)
                .inflate(R.layout.item_transaction, parent, false))
        else -> throw AssertionError()
    }
    /** 
    The binding code will change to support these different holders, too,
    so we'll need to figure out which type we're currently binding. But the binding process itself is left unchanged:
    **/
    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        throw UnsupportedOperationException()
        // we don't need it anymore, everything happens in the other overload
    }

    override fun onBindViewHolder(
        holder: RecyclerView.ViewHolder, position: Int, payloads: List<Any>,
    ) {
        when (val t = getItem(position)) {
            is Item.Day -> (holder.itemView as TextView).text = t.day.toString()
            is Item.Transaction -> bind(holder as TransactionViewHolder, t, payloads)
        }
    }

    private fun bind(
        holder: TransactionViewHolder, t: Item.Transaction, payloads: List<Any>,
    ) {
        // ...
    }
}
```
Các đoạn mã được cung cấp cho đến nay sẽ không đầy đủ nếu không có thêm một chi tiết: `a DiffUtil.ItemCallback implementation`.
Chúng ta cần làm cho nó xử lý được các mặt hàng không đồng nhất của chúng ta ngay bây giờ. Phiên bản sau so sánh các giao dịch theo cách tương tự như trước đây nhưng cũng cung cấp hỗ trợ cho các mục Ngày mới:

```kotlin
object : DiffUtil.ItemCallback<Item>() {
    override fun areItemsTheSame(oldItem: Item, newItem: Item): Boolean =
        when (oldItem) {
            is Item.Day -> oldItem == newItem
            is Item.Transaction -> newItem is Item.Transaction &&
                oldItem.id == newItem.id
        }

    override fun areContentsTheSame(oldItem: Item, newItem: Item): Boolean =
        oldItem == newItem

    override fun getChangePayload(oldItem: Item, newItem: Item): Any? =
        if (oldItem is Item.Transaction && newItem is Item.Transaction) listOfNotNull(
            ChangeField.RECEIVER.takeIf { oldItem.receiver != newItem.receiver },
            ChangeField.AMOUNT.takeIf { oldItem.amount != newItem.amount },
            ChangeField.STATUS.takeIf { oldItem.status != newItem.status },
        ) else null
}
```


Bộ điều hợp có nhiều viewTypes nhanh chóng trở nên lộn xộn, nhưng [khái niệm về ủy quyền bộ điều hợp](https://medium.com/@seidalins/delegate-adapters-building-heterogeneous-recyclerviewadapter-877cb7d3c6c0) đã được phát triển để giải quyết vấn đề. 

### Sử dụng ConcatAdapter

Có thêm một công cụ có thể giúp làm việc với các bộ điều hợp không đồng nhất dễ dàng hơn.
`ConcatAdapter` hoạt động như một bộ chuyển đổi meta kết hợp tuần tự nội dung của một số bộ điều hợp.
Mô hình sử dụng rất đơn giản:

```kotlin
recyclerView.adapter = ConcatAdapter(firstAdapter, secondAdapter)
```

Nó sử dụng các loại chế độ xem ẩn nhưng cho phép bạn tránh lấp đầy chúng bằng các bộ điều hợp của riêng bạn.
Ví dụ: khi bạn cần tiêu đề phía trên danh sách, bạn có thể tạo tiêu đề một mục Adapter và nối nó với phần còn lại:
`ConcatAdapter(headerAdapter, someAdapter)`. Điều này sẽ tạo ra separation of concerns tốt hơn: Adapter chính không biết về tiêu đề và ngược lại, nhưng chúng hoạt động tốt với nhau.

Bạn cũng có thể gọi `addAdapter` và `removeAdapter` trên phiên bản `ConcatAdapter` để thay đổi bộ Adapter một cách linh hoạt:

```kotlin
concatAdapter.removeAdapter(staleAdapter)
concatAdapter.addAdapter(freshAdapter)
```

> [!WARNING]
> `ConcatAdapter` là một tính năng tương đối mới và Adapter của RecyclerView ban đầu được phát triển mà không tính đến `ConcatAdapter`.
> Ví dụ: `ViewHolder.absoluteAdapterPosition` có liên quan đến gốc Adapter và bindingAdapterPosition có liên quan đến gốc trực tiếp của nó.
> `ViewHolder.itemViewType` là tuyệt đối – không có bản sao tương đối nhưng bạn có thể mô phỏng nó bằng cách gọi `getItemViewType(holder.bindingAdapterPosition)` trên Adapter gốc trực tiếp của nó.

```kotlin
class HeaderAdapter : RecyclerView.Adapter<HeaderAdapter.HeaderViewHolder>() {
    class HeaderViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): HeaderViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_header, parent, false)
        return HeaderViewHolder(view)
    }

    override fun onBindViewHolder(holder: HeaderViewHolder, position: Int) {
        ...
    }

    override fun getItemCount(): Int = 1
}
```

```kotlin
class ItemAdapter(private val items: List<String>) : RecyclerView.Adapter<ItemAdapter.ItemViewHolder>() {
    class ItemViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val textView: TextView = itemView.findViewById(R.id.text)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ItemViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_text, parent, false)
        return ItemViewHolder(view)
    }

    override fun onBindViewHolder(holder: ItemViewHolder, position: Int) {
        holder.textView.text = items[position]

        // Lấy vị trí tuyệt đối và tương đối
        Log.d("RecyclerView", "absoluteAdapterPosition: ${holder.absoluteAdapterPosition}, bindingAdapterPosition: ${holder.bindingAdapterPosition}")
    }

    override fun getItemCount(): Int = items.size
}
```


```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val recyclerView: RecyclerView = findViewById(R.id.recyclerView)
        recyclerView.layoutManager = LinearLayoutManager(this)

        val headerAdapter = HeaderAdapter()
        val itemAdapter = ItemAdapter(listOf("Item 1", "Item 2", "Item 3"))

        val concatAdapter = ConcatAdapter(headerAdapter, itemAdapter)
        recyclerView.adapter = concatAdapter
    }
}
```
Đầu ra:
```bash
absoluteAdapterPosition: 1, bindingAdapterPosition: 0
absoluteAdapterPosition: 2, bindingAdapterPosition: 1
absoluteAdapterPosition: 3, bindingAdapterPosition: 2
```
