package com.example.doitnow.ui.main

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.Menu
import android.view.View
import androidx.activity.viewModels
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.widget.SearchView
import androidx.recyclerview.widget.StaggeredGridLayoutManager
import com.example.doitnow.R
import com.example.doitnow.data.model.TaskEntity
import com.example.doitnow.databinding.ActivityMainBinding
import com.example.doitnow.utils.BUNDLE_ID
import com.example.doitnow.utils.DELETE
import com.example.doitnow.utils.EDIT
import com.example.doitnow.utils.HIGH
import com.example.doitnow.utils.LOW
import com.example.doitnow.utils.NORMAL
import com.example.doitnow.viewmodel.MainViewModel
import com.example.doitnow.ui.main.Task.TaskFragment
import com.example.doitnow.utils.DataStatus
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : AppCompatActivity() {
    //Binding
    private var _binding: ActivityMainBinding? = null
    private val binding get() = _binding

    @Inject
    lateinit var taskAdapter: TaskAdapter

    @Inject
    lateinit var taskEntity: TaskEntity

    //Other
    private val viewModel: MainViewModel by viewModels()
    private var selectedItem = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        _binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding?.root)
        //InitViews
        binding?.apply {
            //Support toolbar
            setSupportActionBar(tasksToolbar)

            //Task fragment
            addTaskBtn.setOnClickListener {
                TaskFragment().show(supportFragmentManager, TaskFragment().tag)
            }
            //Get data
            viewModel.getAllTasks()
            viewModel.tasksData.observe(this@MainActivity) {
                showEmpty(it.isEmpty)
                taskAdapter.setData(it.data!!)
                taskList.apply {
                    layoutManager = StaggeredGridLayoutManager(2, StaggeredGridLayoutManager.VERTICAL)
                    adapter = taskAdapter
                }
            }
            //Filter
            tasksToolbar.setOnMenuItemClickListener {
                when (it.itemId) {
                    R.id.actionFilter -> {
                        priorityFilter()
                        return@setOnMenuItemClickListener true
                    }
                    else -> {
                        return@setOnMenuItemClickListener false
                    }
                }
            }
            //Clicks
            taskAdapter.setOnItemClickListener { entity, type ->
                when (type) {
                    EDIT -> {
                        val taskFragment = TaskFragment()
                        val bundle = Bundle()
                        bundle.putInt(BUNDLE_ID, entity.id)
                        taskFragment.arguments = bundle
                        taskFragment.show(supportFragmentManager, TaskFragment().tag)
                    }
                    DELETE -> {
                        taskEntity.id = entity.id
                        taskEntity.title = entity.title
                        taskEntity.desc = entity.desc
                        taskEntity.category = entity.category
                        taskEntity.priority = entity.priority
                        viewModel.deleteTask(taskEntity)
                    }
                }
            }
        }
    }

    private fun showEmpty(isShown: Boolean) {
        binding?.apply {
            if (isShown) {
                emptyLay.visibility = View.VISIBLE
                taskList.visibility = View.GONE
            } else {
                emptyLay.visibility = View.GONE
                taskList.visibility = View.VISIBLE
            }
        }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.menu_toolbar, menu)
        val search = menu.findItem(R.id.actionSearch)
        val searchView = search.actionView as SearchView
        searchView.queryHint = getString(R.string.search)
        searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener {

            override fun onQueryTextSubmit(query: String): Boolean {
                return false
            }

            override fun onQueryTextChange(newText: String): Boolean {
                viewModel.getSearchTasks(newText)
                return true
            }
        })
        return super.onCreateOptionsMenu(menu)
    }

    private fun priorityFilter() {
        val builder = AlertDialog.Builder(this)

        val priority = arrayOf("All", HIGH, NORMAL, LOW)
        builder.setSingleChoiceItems(priority, selectedItem) { dialog, item ->
            when (item) {
                0 -> {
                    viewModel.getAllTasks()
                }
                in 1..3 -> {
                    viewModel.getFilterTasks(priority[item])
                }
            }
            selectedItem = item
            dialog.dismiss()
        }
        val dialog: AlertDialog = builder.create()
        dialog.show()
    }

    override fun onDestroy() {
        super.onDestroy()
        _binding = null
    }
}