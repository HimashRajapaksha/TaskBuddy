package com.example.doitnow.data.database


import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.doitnow.data.model.TaskEntity
import com.example.doitnow.utils.TASK_TABLE
import kotlinx.coroutines.flow.Flow

@Dao
interface TaskDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun saveTask(entity: TaskEntity)

    @Delete
    suspend fun deleteTask(entity: TaskEntity)

    @Update
    suspend fun updateTask(entity: TaskEntity)

    @Query("SELECT * FROM $TASK_TABLE")
    fun getAllTasks(): Flow<MutableList<TaskEntity>>

    @Query("SELECT * FROM $TASK_TABLE WHERE id == :id")
    fun getTask(id: Int): Flow<TaskEntity>

    @Query("SELECT * FROM $TASK_TABLE WHERE priority == :priority")
    fun filetTask(priority: String): Flow<MutableList<TaskEntity>>

    @Query("SELECT * FROM $TASK_TABLE WHERE title LIKE '%' || :title || '%' ")
    fun searchTask(title: String): Flow<MutableList<TaskEntity>>
}