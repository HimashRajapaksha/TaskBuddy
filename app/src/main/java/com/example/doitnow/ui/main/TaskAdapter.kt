package com.example.doitnow.ui.main


import android.annotation.SuppressLint
import android.content.Context
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.appcompat.widget.PopupMenu
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.RecyclerView
import com.example.doitnow.R
import com.example.doitnow.data.model.TaskEntity
import com.example.doitnow.databinding.ItemTasksBinding
import com.example.doitnow.utils.DELETE
import com.example.doitnow.utils.EDIT
import com.example.doitnow.utils.EDUCATION
import com.example.doitnow.utils.HEALTH
import com.example.doitnow.utils.HIGH
import com.example.doitnow.utils.HOME
import com.example.doitnow.utils.LOW
import com.example.doitnow.utils.NORMAL
import com.example.doitnow.utils.WORK
import javax.inject.Inject

class TaskAdapter @Inject constructor() : RecyclerView.Adapter<TaskAdapter.ViewHolder>() {

    private lateinit var binding: ItemTasksBinding
    private lateinit var context: Context
    private var moviesList = emptyList<TaskEntity>()

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        binding = ItemTasksBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        context = parent.context
        return ViewHolder()
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        //getItem from PagingDataAdapter
        holder.bind(moviesList[position])
        //Task duplicate items
        holder.setIsRecyclable(false)
    }

    override fun getItemCount() = moviesList.size

    inner class ViewHolder : RecyclerView.ViewHolder(binding.root) {

        @SuppressLint("SetTextI18n")
        fun bind(item: TaskEntity) {
            binding.apply {
                titleTxt.text = item.title
                descTxt.text = item.desc
                //Category
                when (item.category) {
                    HOME -> categoryImg.setImageResource(R.drawable.home)
                    WORK -> categoryImg.setImageResource(R.drawable.work)
                    EDUCATION -> categoryImg.setImageResource(R.drawable.education)
                    HEALTH -> categoryImg.setImageResource(R.drawable.healthcare)
                }
                //Priority
                when (item.priority) {
                    HIGH -> priorityColor.setBackgroundColor(ContextCompat.getColor(context, R.color.red))
                    NORMAL -> priorityColor.setBackgroundColor(ContextCompat.getColor(context, R.color.yellow))
                    LOW -> priorityColor.setBackgroundColor(ContextCompat.getColor(context, R.color.aqua))
                }
                //Menu
                menuImg.setOnClickListener {
                    val popupMenu = PopupMenu(context, it)
                    popupMenu.menuInflater.inflate(R.menu.menu_items, popupMenu.menu)
                    popupMenu.show()
                    //Select
                    popupMenu.setOnMenuItemClickListener { menuItem ->
                        when (menuItem.itemId) {
                            R.id.itemEdit -> {
                                onItemClickListener?.let {
                                    it(item, EDIT)
                                }
                            }
                            R.id.itemDelete -> {
                                onItemClickListener?.let {
                                    it(item, DELETE)
                                }
                            }
                        }
                        return@setOnMenuItemClickListener true
                    }
                }
            }
        }
    }

    private var onItemClickListener: ((TaskEntity, String) -> Unit)? = null

    fun setOnItemClickListener(listener: (TaskEntity, String) -> Unit) {
        onItemClickListener = listener
    }

    fun setData(data: List<TaskEntity>) {
        val moviesDiffUtil = TaskDiffUtils(moviesList, data)
        val diffUtils = DiffUtil.calculateDiff(moviesDiffUtil)
        moviesList = data
        diffUtils.dispatchUpdatesTo(this)
    }

    class TaskDiffUtils(private val oldItem: List<TaskEntity>, private val newItem: List<TaskEntity>) : DiffUtil.Callback() {

        override fun getOldListSize(): Int {
            return oldItem.size
        }

        override fun getNewListSize(): Int {
            return newItem.size
        }

        override fun areItemsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
            return oldItem[oldItemPosition] === newItem[newItemPosition]
        }

        override fun areContentsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
            return oldItem[oldItemPosition] === newItem[newItemPosition]
        }
    }
}