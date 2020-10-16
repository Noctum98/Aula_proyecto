<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Task;
use App\Classroom;

class TaskController extends Controller
{
    // Controlador de Tasks

    public function test(){
        return "Controlador de Task funcionando";
    }
    public function tasksByClass($id){
        $tasks = Task::where([
            'classroom_id'=>$id
        ])->get();
        $tasks = $tasks->load('answers');
        if($tasks){
            $data = [
                'status'=>'success',
                'code'=>200,
                'tasks'=>$tasks
            ];
        }else{
            $data = [
                'status'=>'error',
                'code' =>404,
                'message'=>'No se pudieron conseguir las tareas'
            ];
        }
        return response()->json($data,$data['code']);
    }
    public function task($id){
        $task = Task::find($id)->load('answers');

        if($task){
            $data = [
                'status'=>'success',
                'code'  =>200,
                'task'  => $task
            ];
        }else{
            $data = [
                'status'=>'error',
                'code' =>404,
                'message'=>'No se pudo conseguir la tarea'
            ];
        }
        return response()->json($data,$data['code']);
    }
    public function store(Request $request,$classroom_id){
        // Recoger datos
        $json = $request->input('json');
        $params = json_decode($json,true);

        if($params){
            // Validar los datos
            $validate = \Validator::make($params,[
                'title'=>['required'],
                'description'=>['required'],
                'content'=>['required'],
            ]);

            if(!$validate->fails()){
               // Conseguir classroom 
               $classroom = Classroom::where(['id'=>$classroom_id])->first();

               if($classroom){
                   $task = new Task();

                   $task->classroom_id = $classroom->id;
                   $task->title = $params['title'];
                   $task->description = $params['description'];
                   $task->content = $params['content'];
                   $task->file = $params['file'];

                   $task->save();

                   $data = [
                       'status'=>'success',
                       'code'=>200,
                       'task'=>$task
                   ];
               }else{
                $data = [
                    'status' => 'error',
                    'code'   => 404,
                    'message'=> 'No se ha podido encontrar la classroom'
                ];
               }
            }else{
                $data = [
                    'status'=>'error',
                    'code'  =>404,
                    'errors'=>$validate->errors()
                ];
            }
        }else{
            $data = [
                'status'=>'error',
                'code' =>404,
                'message'=>'Los datos no han sido enviado correctamente'
            ];
        }
        return response()->json($data,$data['code']);
    }

    public function update(Request $request,$id){
        // Recoger los paramtetros
        $json =  $request->input('json');
        $params = json_decode($json,true);

        if($params){
            // Validar los datos
            $validate = \Validator::make($params,[
                'title'=>['required'],
                'content'=>['required']
            ]);

            if(!$validate->fails()){
                // Borar datos que no queramos actualizar
                unset($params['classroom_id']);
                unset($params['file']);

                // Guardar los datos
                $taskUpdated = Task::where([
                    'id'=>$id
                ])->update($params);

                if($taskUpdated){
                    $data = [
                        'status'=>'success',
                        'code' => 200,
                        'taskUpdated'=>$params
                    ];
                }else{
                    $data = [
                        'status'=>'error',
                        'code' =>404,
                        'message'=>'No se pudo actualizar la classroom'
                    ];
                }
            }else{
                $data = [
                    'status'=>'error',
                    'code'  =>404,
                    'errors'=>$validate->errors()
                ];
            }

        }else{
            $data = [
                'status'=>'error',
                'code' =>404,
                'message'=>'Los datos no han sido enviado correctamente'
            ];
        }

        return response()->json($data,$data['code']);
    }

    public function file(Request $request){
        // Recogo los parametros
        $file = $request->file('file0');

        $validate =  \Validator::make($request->all(),[
            'file0' => ['mimes:pdf,doc,docx,odp,txt','required']
        ]);

        if(!$validate->fails()){
            $filename = time().$file->getClientOriginalName();

            \Storage::disk('tasks')->put($filename,\File::get($file));

            $data = [
                'status'=>'success',
                'code' => 200,
                'file' => $filename
            ];
        }else{
            $data = [
                'status'=>'error',
                'code'  =>404,
                'errors'=>$validate->errors()
            ];
        }
        return response()->json($data,$data['code']);
    }

    public function getFile($filename){
        $exists = \Storage::disk('tasks')->exists($filename);

        if($exists){
            return \Storage::disk('tasks')->download($filename);
        }else{
            $data = [
                'status'=>'error',
                'code'  =>404,
                'message'=>'El archivo no existe'
            ];
        }

        return response()->json($data,$data['code']);
    }
}
