package com.example.doitnow.data.repository

import javax.inject.Inject
import com.example.doitnow.data.database.TaskDao
import com.example.doitnow.data.model.TaskEntity



class TaskRepository @Inject constructor(private val dao: TaskDao) {
    suspend fun saveTask(entity: TaskEntity) = dao.saveTask(entity)
    suspend fun updateTask(entity: TaskEntity) = dao.updateTask(entity)
    fun getTask(id: Int) = dao.getTask(id)
}