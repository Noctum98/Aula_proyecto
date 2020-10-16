<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    //Modelo de member
    protected $table = 'members';

    public function classroom(){
        return $this->belongsTo('App\Classroom','classroom_id');
    }

    public function user(){
        return $this->belongsTo('App\User','user_id');
    }

    public function answers(){
        return $this->hasMany('App\Answer');
    }
}
