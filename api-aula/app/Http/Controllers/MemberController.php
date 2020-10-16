<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Member;
use App\Classroom;

class MemberController extends Controller
{
    // Controlador de Member

    public function test(){
        return "Controlador de member funcionando";
    }

    public function index(){
        $members = Member::all();

        return response()->json([
            'status'=>'success',
            'members'=>$members
        ],200);
    }
    public function memberByClass($id){
        $members = \DB::select("SELECT m.id,m.role,u.name,u.surname FROM members m INNER JOIN users u ON user_id = u.id WHERE classroom_id = ?",[$id]);
        
        if($members){
            $data = [
                'status'=>'success',
                'code'=>200,
                'members'=>$members
            ];
        }else{
            $data = [
                'status'=>'error',
                'code'=>200,
                'message'=>'No hay miembros para esta clase'
            ];
        }

        return response()->json($data,$data['code']);
    }
    public function store(Request $request,$code){
        // Recoger datos y usuario
        $user = $this->getUser($request);
        $classroom = Classroom::where([
            'code' => $code
        ])->first();

        if($classroom){
            // Validar los datos
            $memberSearch = Member::where([
                'classroom_id' => $classroom->id,
                'user_id'   =>  $user->sub
            ])->first();

            if(!$memberSearch){
                // Instanciar la clase y setear los valores
                $member = new Member();

                $member->classroom_id = $classroom->id;
                $member->user_id = $user->sub;
                $member->role = 'ROLE_STUDENT';

                $member->save();

                $data = [
                    'status'=>'success',
                    'code'=>200,
                    'member'=>$member
                ];

            }else{
                $data = [
                    'status'=>'error',
                    'code'  =>404,
                    'errors'=>'Ya eres miembro de es clase'
                ];
            }

        }else{
            $data = [
                'status'=>'error',
                'code' => 200,
                'message'=>'No existe una clase con el código enviado'
            ];
        }
        return response()->json($data,$data['code']);
    }
    public function memberByUser(Request $request,$classroom_id){
        $user = $this->getUser($request);
        $member = Member::where([
            'user_id' => $user->sub,
            'classroom_id' => $classroom_id
        ])->first();

        if($member){
            $data = [
                'status'=>'success',
                'code'=>200,
                'member'=>$member
            ];
        }else{
            $data = [
                'status'=>'error',
                'code'=>404,
                'message'=>'No se pudo encontrar el miembro de la classroom'
            ];
        }
        return response()->json($data,$data['code']);
    }
    public function setRole(Request $request,$id){
        $json = $request->input('json');
        $params = json_decode($json,true);

        if($params){
            $validate = \Validator::make($params,[
                'role'=>['required']
            ]);

            if(!$validate->fails()){
                unset($params['user_id']);
                unset($params['created_at']);
                unset($params['updated_at']);

                $member = Member::where([
                    'id'=>$id
                ])->update($params);

                if($member){

                    $data = [
                        'status'=>'success',
                        'code'=>200,
                        'memberUpdated'=>$member
                    ];
                }else{
                    $data = [
                        'status'=>'error',
                        'code'=>404,
                        'message'=>'No se pudo encontrar el miembro de la classroom'
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

    //----------Metodo para conseguir usuario---------//
    public function getUser($request){
        $token = $request->header('Authorization');
        $jwtAuth = new \JwtAuth();
        $user = $jwtAuth->checkToken($token,true);

        return $user;
    }
}
