<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Answer;
use App\Member;

class AnswerController extends Controller
{
    // Controlador de Answers

    public function answersByTask($task_id){
        $answers = \DB::select(
            'SELECT a.content,a.id,a.file,u.name,u.surname FROM answers a INNER JOIN members m ON member_id = m.id INNER JOIN users u ON m.user_id = u.id WHERE task_id = ?',
            [$task_id]
        );

        if($answers){
            $data = [
                'status'=>'success',
                'code' => 200,
                'answers' => $answers
            ];
        }else{
            $data = [
                'status'=>'success',
                'code' => 200,
                'message' => 'No se pudieron obtener las respuestas'
            ];
        }
        return response()->json($data,$data['code']);
    }

    public function answerByMemberTask(Request $request,$task_id){
        $user = $this->getUser($request);
        $member = Member::where('user_id',$user->sub)->first();

        $answer = Answer::where([
            'task_id'=>$task_id,
            'member_id' => $member->id
        ])->get();

        if($answer){
            $data = [
                'status' => 'success',
                'code'  => 200,
                'answer'=> $answer
            ];
        }else{
            $data = [
                'status'=>'error',
                'code'=>404,
                'message' => 'No existen respuestas de el usuario a la tarea'
            ];
        }
        return response()->json($data,$data['code']);
    }
    public function detail($answer_id){

        $answer = \DB::select('SELECT a.*,u.name,u.surname FROM answers a INNER JOIN members m ON member_id = m.id INNER JOIN users u ON m.user_id = u.id WHERE a.id = ?',
        [$answer_id]);

        if($answer){
            $data = [
                'status'=>'success',
                'code' => 200,
                'answer' => $answer
            ];
        }else{
            $data = [
                'status'=>'error',
                'code'=>404,
                'message' => 'No se pudo conseguir la respuesta'
            ];
        }

        return response()->json($data,$data['code']);
    }

    public function store(Request $request,$classroom_id){
        // Recoger los parametros y usuario identificado
        $json = $request->input('json');
        $params = json_decode($json,true);

        $user = $this->getUser($request);
 
        if($params){
            // Validar los datos
            $validate = \Validator::make($params,[
                'content' => ['required']
            ]);
            
            if(!$validate->fails()){

                // Buscar el miembro de la classroom
                $member = Member::where([
                    'user_id'=>$user->sub,
                    'classroom_id'=> $classroom_id
                ])->first();

                $answer = new Answer();
                $answer->task_id = $params['task_id'];
                $answer->member_id = $member->id;
                $answer->content = $params['content'];
                $answer->file = $params['file'];

                $answer->save();

                $data = [
                    'status'=>'success',
                    'code'  =>200,
                    'answer'=>$answer
                ];
 
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
                'code'=>404,
                'message' => 'No se han enviado los datos correctamente'
            ];
        }
        return response()->json($data,$data['code']);
    }

    public function update(Request $request,$answer_id){
        // Recoger parametros
        $json = $request->input('json');
        $params = json_decode($json,true);

        if($params){
            // Validar los datos
            $validate = \Validator::make($params,[
                'content' => 'required'
            ]);
            
            if(!$validate->fails()){
                // Borrar parametros que no necesite actualizar
                unset($params['task_id']);
                unset($params['member_id']);
                unset($params['created_at']);

                $answerUpdated = Answer::where('id',$answer_id)->update($params);

                if($answerUpdated){
                    $data = [
                        'status'=>'success',
                        'code'  =>200,
                        'answerUpdated'=>$params
                    ];

                }else{
                    $data = [
                        'status'=>'error',
                        'code'=>404,
                        'message' => 'No se pudo actualizar la respuesta'
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
                'code'=>404,
                'message' => 'No se han enviado los datos correctamente'
            ];
        }
        return response()->json($data,$data['code']);
    }

    public function file(Request $request){
        $file = $request->file('file0');
        $filename = time().$file->getClientOriginalName();

        $validate = \Validator::make($request->all(),[
            'file0' => ['required','mimes:pdf,doc,docx,odp,txt']
        ]);

        if(!$validate->fails()){
            \Storage::disk('answers')->put($filename,\File::get($file));

            $data = [
                'status'=>'success',
                'code'  =>200,
                'file'  =>$filename
            ];
        }else{
            $data = [
                'status' => 'error',
                'code'  => 404,
                'errors' => $validate->errors()
            ];
        }

        return response()->json($data,$data['code']);
    }

    public function getFile($filename){
        $exist = \Storage::disk('answers')->exists($filename);

        if($exist){
            return \Storage::disk('answers')->download($filename);;
        }else{
            $data = [
                'status' => 'error',
                'code'  =>404,
                'message' =>'No existe el archivo con ese nombre'
            ];
        }
        return response()->json($data['code']);
    }
    
    //----------Metodo para conseguir usuario---------//
    public function getUser($request){
        $token = $request->header('Authorization');
        $jwtAuth = new \JwtAuth();
        $user = $jwtAuth->checkToken($token,true);

        return $user;
    }
}
