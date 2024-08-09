package com.example.doitnow.data.database

import androidx.room.Database
import androidx.room.RoomDatabase
import com.example.doitnow.data.model.TaskEntity
import com.example.doitnow.data.database.TaskDao

@Database(entities = [TaskEntity::class], version = 1, exportSchema = false)
abstract class TaskDatabase : RoomDatabase() {
    abstract fun taskDao(): TaskDao
}