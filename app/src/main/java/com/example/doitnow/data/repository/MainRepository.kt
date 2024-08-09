package com.example.doitnow.data.repository


import com.example.doitnow.data.database.TaskDao
import com.example.doitnow.data.model.TaskEntity

import javax.inject.Inject

class MainRepository @Inject constructor(private val dao: TaskDao) {
    fun allTasks() = dao.getAllTasks()
    fun searchTasks(search:String) = dao.searchTask(search)
    fun filterTasks(filter:String) = dao.filetTask(filter)
    suspend fun deleteTask(entity:TaskEntity) = dao.deleteTask(entity)

}