<?php

namespace App\Http\Controllers;

use App\Classroom;
use App\Member;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ClassroomController extends Controller
{
    // Controlador de Classroom
    public function index(){
        $classrooms = Classroom::all();

        return response()->json([
            'status'=>'success',
            'classrooms'=>$classrooms
        ],200);
    }

    public function show(Request $request,$id){
        // Identifico al usuario identificado
        $user = $this->getUser($request);

        $classroom = Classroom::where('id',$id)->first();
        
        // Verifico quien es el creador de la classroom
        if($classroom && $classroom->user_id == $user->sub){
            $classroom = $classroom->load('user');
            $data = [
                'status' => 'success',
                'code'   => 200,
                'classroom'=>$classroom
            ];
        }elseif($classroom && $classroom->user_id != $user->sub){
            // En caso de que no se al creador no muestro los datos de el usuario ni el codigo de la classroom
            $member = Member::where([
                'user_id'=>$user->sub,
                'classroom_id'=>$classroom->id
            ])->first();

            if($member){
                unset($classroom->code);
                unset($classroom->created_at);
                unset($classroom->updated_at);
                unset($classroom->user_id);
                $data = [
                    'status' => 'success',
                    'code'   => 200,
                    'classroom'=>$classroom
                ];
            }else{
                $data = [
                    'status' => 'error',
                    'code'   => 404,
                    'message'=>'No tienes permisos para entrar a esta clase'
                ];
            }            
        }else{
            $data = [
                'status' => 'error',
                'code'   => 404,
                'message'=>'La clase no existe'
            ];
        }

        return response()->json($data,$data['code']);
    }
    public function store(Request $request){
        // Recogo los datos
        $json = $request->input('json');
        $params = json_decode($json,true);

        if($params){
            // Validar los datos
            $validate = \Validator::make($params,[
                'name'          =>['required'],
                'description'   =>['required'],
            ]);

            if(!$validate->fails()){
                // Identifico al usuario identificado
                $user = $this->getUser($request);

                // Instanciar objeto y setear valores
                $classroom = new Classroom();
                $classroom->user_id = $user->sub;
                $classroom->name = $params['name'];
                $classroom->description = $params['description'];
                $classroom->image = $params['image'];
                $classroom->code = time();

                $classroom->save();

                $data = [
                    'status'=>'success',
                    'code' => 200,
                    'classroom' =>$classroom
                ];


            }else{
                $data = [
                    'status'  => 'error',
                    'code'    => 404,
                    'error' => $validate->errors()
                ];
            }

        }else{
            $data = [
                'status'=>'error',
                'code' => 404,
                'message'=>'Los datos no fueron enviados correctamente'
            ];
        }
        return response()->json($data,$data['code']);
    }

    public function update(Request $request,$id){
        // Recojo los datos
        $json = $request->input('json');
        $params = json_decode($json,true);

        //Recoger el usuario identificado
        $user = $this->getUser($request);
        
        if($params){
            // Valido los datos
            $validate = \Validator::make($params,[
                'name' => ['required'],
                'description' => ['required']
            ]);
            
            if(!$validate->fails()){
                // Elimino datos que no necesito
                unset($params['id']);
                unset($params['user_id']);
                unset($params['code']);
                unset($params['created_at']);
                
                // Busco la classroom y actualiza
                $classroom = Classroom::where([
                    'id' => $id,
                    'user_id' => $user->sub
                ])->update($params);

                if($classroom){
                    $data = [
                        'status'=>'success',
                        'code' => 200,
                        'classroom_updated'=>$params
                    ];
                }else{
                    $data = [
                        'status'=>'error',
                        'code' => 404,
                        'message'=>'La classroom no existe'
                    ];
                }
            }else{
                $data = [
                    'status'=>'error',
                    'code' => 404,
                    'message'=>'Los datos no fueron enviados correctamente'
                ];
            }
        }

        return response()->json($data,$data['code']);
    }
    public function upload(Request $request){
        
        $image = $request->file('file0');

        $validate = \Validator::make($request->all(),[
            'file0' => ['image','required']
        ]);

        if(!$validate->fails()){
            $image_name = time().$image->getClientOriginalName();

            \Storage::disk('classrooms')->put($image_name,\File::get($image));

            $data = [
                'status'=>'success',
                'code'=>200,
                'image'=>$image_name
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

    public function getImage(string $filename){
        // Comprobar que existe la imágen
        $isset = \Storage::disk('classrooms')->exists($filename);

        if($isset){
            $image = \Storage::disk('classrooms')->get($filename);

            return new Response($image,200);

        }else{
            $data = [
                'status'=>'error',
                'code'=>404,
                'message'=>'La imágen no existe'
            ];
        }
        return response()->json($data,$data['code']);
    }
    public function classByUser(Request $request){
        $user = $this->getUser($request);

        $classrooms = Classroom::where('user_id',$user->sub)->get();

        if($classrooms){
            $data = [
                'status'=>'success',
                'code'  =>200,
                'classrooms'=>$classrooms
            ];
        }else{
            $data = [
                'status'=>'error',
                'code'  =>404,
                'message'=>'Error al buscar las clasrooms'
            ];
        }

        return response()->json($data,$data['code']);
    }
    public function classByMember(Request $request){
        $user = $this->getUser($request);
        $classrooms = \DB::select("SELECT * FROM classrooms WHERE id in(SELECT classroom_id FROM members WHERE user_id = ?)",[$user->sub]);

        if($classrooms){
            $data = [
                'status'=>'success',
                'code'  =>200,
                'classrooms'=>$classrooms
            ];
        }else{
            $data = [
                'status'=>'failed',
                'code'  =>200,
                'message'=>'NO hay classrooms'
            ];
        }

        return response()->json($data,$data['code']);
    }
    //----------Metodo para conseguir usuario---------//
    public function getUser($request){
        $token = $request->header('Authorization');
        $jwtAuth = new \JwtAuth();
        $user = $jwtAuth->checkToken($token,true);

        return $user;
    }

}
