<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    //Modelo de Classroom
    protected $table = 'classrooms';

    public function user(){
        return $this->belongsTo('App\User','user_id');
    }
    public function tasks(){
        return $this->hasMany('App\Task');
    }
    public function members(){
        return $this->hasMany('App\Member');
    }
}
