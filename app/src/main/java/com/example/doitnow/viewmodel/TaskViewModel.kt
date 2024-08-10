package com.example.doitnow.viewmodel

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.doitnow.data.model.TaskEntity
import com.example.doitnow.data.repository.TaskRepository
import com.example.doitnow.utils.DataStatus
import com.example.doitnow.utils.EDUCATION
import com.example.doitnow.utils.HEALTH
import com.example.doitnow.utils.HIGH
import com.example.doitnow.utils.HOME
import com.example.doitnow.utils.LOW
import com.example.doitnow.utils.NORMAL
import com.example.doitnow.utils.WORK
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class TaskViewModel @Inject constructor(private val repository: TaskRepository) : ViewModel() {
    //Spinners
    val categoriesList = MutableLiveData<MutableList<String>>()
    val prioritiesList = MutableLiveData<MutableList<String>>()
    val taskData = MutableLiveData<DataStatus<TaskEntity>>()

    fun loadCategoriesData() = viewModelScope.launch(Dispatchers.IO) {
        val data = mutableListOf(WORK, EDUCATION, HOME, HEALTH)
        categoriesList.postValue(data)
    }

    fun loadPrioritiesData() = viewModelScope.launch(Dispatchers.IO) {
        val data = mutableListOf(HIGH, NORMAL, LOW)
        prioritiesList.postValue(data)
    }

    fun saveEditTask(isEdit: Boolean, entity: TaskEntity) = viewModelScope.launch(Dispatchers.IO) {
        if (isEdit) {
            repository.updateTask(entity)
        } else {
            repository.saveTask(entity)
        }
    }

    fun getData(id: Int) = viewModelScope.launch {
        repository.getTask(id).collect {
            taskData.postValue(DataStatus.success(it, false))
        }
    }
}