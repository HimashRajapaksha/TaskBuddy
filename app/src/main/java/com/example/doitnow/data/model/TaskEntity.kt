package com.example.doitnow.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.example.doitnow.utils.TASK_TABLE

@Entity(tableName = TASK_TABLE)
data class TaskEntity(
    @PrimaryKey(autoGenerate = true)
    var id: Int = 0,
    var title: String = "",
    var desc: String = "",
    var category: String = "",
    var priority: String = ""
)