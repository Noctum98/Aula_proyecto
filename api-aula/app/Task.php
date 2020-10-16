<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    //Modelo de Task
    protected $table = 'tasks';

    public function classroom(){
        return $this->belongTo('App\Classroom','classroom_id');
    }
    public function answers(){
        return $this->hasMany('App\Answer');
    }
}
