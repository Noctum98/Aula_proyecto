<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    //Modelo de Answer
    protected $table = 'answers';

    public function task(){
        return $this->belongsTo('App\Task','task_id');
    }
    public function member(){
        return $this->belongsTo('App\Member','member_id');
    }
}
