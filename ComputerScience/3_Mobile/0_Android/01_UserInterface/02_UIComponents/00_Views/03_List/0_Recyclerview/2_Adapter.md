# Recyclerview Adapter

## Partial updates

The purpose of the `notifyItemChanged` / `notifyItemRangeChanged` family of methods is simple:
**they let the Adapter know about changes so that it can rebind items.**


However, these methods also have some special overloads involving the payload parameter:

- `notifyItemChanged(position: Int, payload: Any?)`
- `notifyItemRangeChanged(positionStart: Int, itemCount: Int, payload: Any?)`

The **change payload** serves as a message that describes what has changed inside an item. When `payload == null`, a full update occurs. So the old ViewHolder gets crossfaded with a new, freshly bound one (assuming the default item animator is being used).

When `payload == null`, a full update occurs. So the old `ViewHolder` gets crossfaded with a new, freshly bound one (assuming the default item animator is being used).

However, if the `payload != null`, it gets passed to the `onBindViewHolder(…, …, payloads: List<Any>)` method, and the default item animator does nothing. This means we can pass anything except null as a payload to bypass **change animation** altogether.
And if we take this approach, items will be updated immediately, without the blinking caused by crossfade animation.


When using `DiffUtil`, this can be achieved by overriding the `getChangePayload` method:

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

However, the primary purpose of change payloads is to deliver some useful information to `onBindViewHolder`.
This method has two overloads, so to take advantage of payloads, we need to override the relevant one:

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

That gives us a list of payloads. It will be empty in case of a full update; otherwise, it will contain all the values passed to the `notify` method since the last binding.

Unlike `notifyItemChanged`, `getChangePayload` can give you only a single payload object. If you return a collection, `payloads` list will contain this collection, not its items. Consider this indirection when handling payloads.


## Fully Example

Imagine an alternative banking system where several transaction attributes may change while it is being processed:

- receiver can redirect it to their partner or agent,
- amount can be slightly decreased if it turns out that the transaction gets processed inside one bank and one country,
- status can change from `PROCESSING` to `FAILED` or `SUCCESSFUL`.

Thus, the `Transaction` class is going to look like this:

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

To keep track of property changes, we need to enumerate them:

```kotlin
enum class ChangeField {
    RECEIVER, AMOUNT, STATUS,
}
```

Payload is going to list all changed properties:

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

With that done, we can use the code shown below to apply updates, including partial ones when requested:

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


**The main purpose of payload machinery is to apply changes faster.**
This is very important when dealing with volatile data like real-time stock prices, which change several times a second.
But in simpler scenarios, passing a dummy payload (like Unit) is a straightforward way to apply minor updates without change animation (as explained earlier in this section).

## Heterogeneous adapters and view types

The dynamic lists created by RecyclerView can contain a variety of item types, and there are many ways that this can be useful.

For example, we could place simple headers between items or include several completely different views in the same list.

The Adapter includes the concept of **view types** for this purpose. But to use them, we first need to make our data **heterogeneous**.
Let's use transactions and days as an example:

We now need to convert our Adapter to use `Item` instead of `Transaction` and base `ViewHolder` instead of our `TransactionHolder`:


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
The code snippets provided so far would be incomplete without one further detail: `a DiffUtil.ItemCallback implementation`.
We need to make it handle our heterogeneous items now. The following version compares transactions in the same way as it did before, but also provides support for the new Day items:

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


Adapters with many viewTypes become cluttered fast, but there's a [concept of adapter delegates](https://medium.com/@seidalins/delegate-adapters-building-heterogeneous-recyclerviewadapter-877cb7d3c6c0) developed to address the issue. 

### Using ConcatAdapter

There's one more tool that can make working with heterogeneous adapters easier.
`ConcatAdapter` acts as a meta-adapter joining several adapters' contents sequentially.
The usage pattern is straightforward:

```kotlin
recyclerView.adapter = ConcatAdapter(firstAdapter, secondAdapter)
```

It uses view types under the hood but allows you to avoid filling your own adapters with them.
For example, when you need a header above a list, you can create a single-item header Adapter and concatenate it with the rest:
`ConcatAdapter(headerAdapter, someAdapter)`. This will result in a better separation of concerns: the main Adapter doesn't know about the header, and vice versa, but they work well together.

You can also call `addAdapter` and `removeAdapter` on an instance of `ConcatAdapter` to change the Adapter set dynamically:

```kotlin
concatAdapter.removeAdapter(staleAdapter)
concatAdapter.addAdapter(freshAdapter)
```

> [!WARNING]
> `ConcatAdapter` is a relatively new feature, and RecyclerView's Adapter was initially developed without `ConcatAdapter` in mind.
> For example, `ViewHolder.absoluteAdapterPosition` is relative to the root Adapter, and bindingAdapterPosition is relative to its direct parent.
> `ViewHolder.itemViewType` is absolute – there's no relative counterpart, but you can simulate it by calling `getItemViewType(holder.bindingAdapterPosition)` on its direct parent Adapter.

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
Output:
```bash
absoluteAdapterPosition: 1, bindingAdapterPosition: 0
absoluteAdapterPosition: 2, bindingAdapterPosition: 1
absoluteAdapterPosition: 3, bindingAdapterPosition: 2
```