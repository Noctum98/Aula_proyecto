<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\ApiAuthMiddleware;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/*Route::get('/', function () {
    return view('welcome');
});*/

// Ruta de prueba
Route::get('/test','UserController@test');

// Rutas de user
Route::group(['prefix' => 'user'], function () {
    Route::post('register','UserController@register');
    Route::post('login','UserController@login');
    Route::put('update','UserController@update')->middleware(ApiAuthMiddleware::class);
    Route::post('upload','UserController@upload');
    Route::get('image/{filename}','UserController@getImage');
});

// Rutas de classroom
Route::resource('classroom', 'ClassroomController')->middleware(ApiAuthMiddleware::class);
Route::group(['prefix' => 'classroom','middleware'=>'api.auth'], function () {
    Route::post('upload','ClassroomController@upload');
    Route::get('user/byUser','ClassroomController@classByUser');
    Route::get('member/byMember','ClassroomController@classByMember');
});
Route::get('classroom/image/{filename}','ClassroomController@getImage');
// Rutas de member
Route::group(['prefix' => 'member','middleware'=>'api.auth'], function () {
    Route::get('test','MemberController@test');
    Route::get('index','MemberController@index');
    Route::get('user/{user_id}','MemberController@memberByUser');
    Route::get('classroom/{id}','MemberController@memberByClass');
    Route::post('store/{code}','MemberController@store');
    Route::put('role/{id}','MemberController@setRole');
});

// Rutas de task
Route::group(['prefix' => 'task','middleware'=>'api.auth'], function () {
    Route::get('test','TaskController@test');
    Route::get('/{id}','TaskController@task');
    Route::get('classroom/{id}','TaskController@tasksByClass');
    Route::post('store/{classroom_id}','TaskController@store');
    Route::put('update/{id}','TaskController@update');
    Route::post('file','TaskController@file');
});
Route::get('/task/file/{filename}','TaskController@getFile');

// Rutas de answer
Route::group(['prefix' => 'answer','middleware'=>'api.auth'], function () {
    Route::get('task/{id}','AnswerController@answersByTask');   
    Route::get('detail/{id}','AnswerController@detail');
    Route::post('store/{classroom_id}','AnswerController@store');
    Route::put('update/{id}','AnswerController@update'); 
    Route::post('file','AnswerController@file');
});
Route::get('/answer/file/{filename}','AnswerController@getFile');