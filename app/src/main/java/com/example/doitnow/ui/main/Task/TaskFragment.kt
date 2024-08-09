package com.example.doitnow.ui.main.Task


import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.viewModels
import com.example.doitnow.data.model.TaskEntity
import com.example.doitnow.databinding.FragmentTaskBinding
import com.example.doitnow.utils.BUNDLE_ID
import com.example.doitnow.utils.EDIT
import com.example.doitnow.utils.NEW
import com.example.doitnow.utils.getIndexFromList
import com.example.doitnow.utils.setupListWithAdapter
import com.example.doitnow.viewmodel.TaskViewModel
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@AndroidEntryPoint
class TaskFragment : BottomSheetDialogFragment() {
    //Binding
    private var _binding: FragmentTaskBinding? = null
    private val binding get() = _binding

    @Inject
    lateinit var entity: TaskEntity

    //Other
    private val viewModel: TaskViewModel by viewModels()
    private var category = ""
    private var priority = ""
    private var taskId = 0
    private var type = ""
    private var isEdit = false
    private val categoriesList: MutableList<String> = mutableListOf()
    private val prioriesList: MutableList<String> = mutableListOf()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentTaskBinding.inflate(layoutInflater)
        return binding!!.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        //Bundle
        taskId = arguments?.getInt(BUNDLE_ID) ?: 0
        //Type
        if (taskId > 0) {
            type = EDIT
            isEdit = true
        } else {
            isEdit = false
            type = NEW
        }
        //InitViews
        binding?.apply {
            //Close
            closeImg.setOnClickListener { dismiss() }
            //Spinner Category
            viewModel.loadCategoriesData()
            viewModel.categoriesList.observe(viewLifecycleOwner) {
                categoriesList.addAll(it)
                categoriesSpinner.setupListWithAdapter(it) { itItem -> category = itItem }
            }
            //Spinner priority
            viewModel.loadPrioritiesData()
            viewModel.prioritiesList.observe(viewLifecycleOwner) {
                prioriesList.addAll(it)
                prioritySpinner.setupListWithAdapter(it) { itItem -> priority = itItem }
            }
            //Task data
            if (type == EDIT) {
                viewModel.getData(taskId)
                viewModel.taskData.observe(viewLifecycleOwner) { itData ->
                    itData.data?.let {
                        titleEdt.setText(it.title)
                        descEdt.setText(it.desc)
                        categoriesSpinner.setSelection(categoriesList.getIndexFromList(it.category))
                        prioritySpinner.setSelection(prioriesList.getIndexFromList(it.priority))
                    }
                }
            }
            //Click
            saveTask.setOnClickListener {
                val title = titleEdt.text.toString()
                val desc = descEdt.text.toString()
                entity.id = taskId
                entity.title = title
                entity.desc = desc
                entity.category = category
                entity.priority = priority

                if (title.isNotEmpty() && desc.isNotEmpty()) {
                    viewModel.saveEditTask(isEdit, entity)
                }

                dismiss()
            }
        }
    }

    override fun onStop() {
        super.onStop()
        _binding = null
    }
}