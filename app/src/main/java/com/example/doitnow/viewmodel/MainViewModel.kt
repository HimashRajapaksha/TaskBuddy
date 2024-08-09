package com.example.doitnow.viewmodel



import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.doitnow.data.model.TaskEntity
import com.example.doitnow.data.repository.MainRepository
import com.example.doitnow.utils.DataStatus
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject



@HiltViewModel
class MainViewModel @Inject constructor(private val repository: MainRepository) : ViewModel() {

    var tasksData = MutableLiveData<DataStatus<List<TaskEntity>>>()

    fun getAllTasks() = viewModelScope.launch {
        repository.allTasks().collect {
            tasksData.postValue(DataStatus.success(it, it.isEmpty()))
        }
    }
    fun getSearchTasks(search: String) = viewModelScope.launch {
        repository.searchTasks(search).collect {
            tasksData.postValue(DataStatus.success(it, it.isEmpty()))
        }
    }

    fun getFilterTasks(filter: String) = viewModelScope.launch {
        repository.filterTasks(filter).collect {
            tasksData.postValue(DataStatus.success(it, it.isEmpty()))
        }
    }

    fun deleteTask(entity: TaskEntity) = viewModelScope.launch {
        repository.deleteTask(entity)
    }
}