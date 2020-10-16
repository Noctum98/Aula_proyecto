<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;


class UserController extends Controller
{
    // Controlador de Usuario

    public function test(){
        return "Controlador user funcionando";
    }

    public function register(Request $request){
        // Recoger los datos
        $json = $request->input('json');
        $params = json_decode($json,true);

        if(!empty($params)){
            // Limpiar los datos
            $params = array_map('trim',$params);
            // Validar los datos
            $validate = \Validator::make($params,[
                'name'      => ['required','alpha'],
                'surname'   =>['required','alpha'],
                'email'     => ['required','email','unique:users'],
                'password'  => ['required']
            ]);

            if(!$validate->fails()){
                // Encriptar contraseña
                $pass_hash = password_hash($params['password'],PASSWORD_BCRYPT,['cost'=>4]);

                // Setear valores
                $user = new User();
                $user->name = $params['name'];
                $user->surname = $params['surname'];
                $user->email = $params['email'];
                $user->image = $params['image'];
                $user->password = $pass_hash;

                // Guardar datos
                $user->save();

                $data = [
                    'status'    => 'success',
                    'code'      => 200,
                    'user'      => $user
                ];
            }else{
                $data = [
                    'status'    => 'error',
                    'code'      => 404,
                    'errors'    => $validate->errors()
                ];
            }

        }else{
            $data = [
                'status' => 'error',
                'code'   => 404,
                'message' => 'Los datos no han sido enviados'
            ];
        }

        return response()->json($data,$data['code']);
    }
    
    public function login(Request $request){
        // Recoger los datos
        $json = $request->input('json');
        $params = json_decode($json,true);

        // Validar los datos
        $validate = \Validator::make($params,[
            'email'     => ['required','email'],
            'password'  => ['required']
        ]);

        if(!$validate->fails()){
            // Realizar la comprobación
            $jwtAuth = new \JwtAuth();
            $data = [];
            $data['data'] = $jwtAuth->signup($params['email'],$params['password']);
            $data['code'] = 200;

            if(!empty($params['remember_token'])){
                $data['data'] = $jwtAuth->signup($params['email'],$params['password'],true);
            }
        }else{
            $data = [
                'status' => 'error',
                'code'   => 404,
                'errors' => $validate->errors()
            ];
        }

        return response()->json($data,$data['code']);

    }

    public function update(Request $request){
        // Recogo los datos
        $json = $request->input('json');
        $params = json_decode($json,true);

        //Tomo al usuario identifivado
        $jwtAuth = new \JwtAuth();
        $user = $jwtAuth->checkToken($request->header('Authorization'),true);

        // Validar los datos
        if($params){
            $validate = \Validator::make($params,[
                'name'      =>  ['required','alpha'],
                'surname'   =>  ['required','alpha'],
                'email'     =>  ['required','email',Rule::unique('users')->ignore($user->sub)],
            ]);

            if(!$validate->fails()){
                // Quitamos parametros que no queramos actualizar
                unset($params['password']);
                unset($params['created_at']);
                unset($params['remember_token']);
                
                // Buscamos el usuario y lo actualizamos
                $user_updated = User::where([
                    'id'=>$user->sub
                ])->update($params);

                // Devolvemos un resultado

                $data = [
                    'status'    =>'success',
                    'code'      => 200,
                    'changes'   => $params
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
                'status' => 'error',
                'code'   => 404,
                'message'=> 'Los datos no han sido enviados correctamente'
            ];
        }
        return response()->json($data,$data['code']);
    }
    public function upload(Request $request){
        // Recogemos los parametros
        $image = $request->file('file0');

        // Verificamos que llegan los datos y validamos
        if($image){
            
            $validate = \Validator::make($request->all(),[
                'file0' => ['required','image']
            ]);

            if(!$validate->fails()){
                // Guaramos la imágen
                $image_name = time().$image->getClientOriginalName();
                \Storage::disk('users')->put($image_name,\File::get($image));

                $data = [
                    'status'=>'success',
                    'code'  =>200,
                    'image' => $image_name
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
                'status' => 'error',
                'code'   => 404,
                'message'=> 'Los datos no han sido enviados correctamente'
            ];
        }

        return response()->json($data,$data['code']);

    }

    public function getImage(string $filename){
        // Comprobar si la imágen existe
        $isset = \Storage::disk('users')->exists($filename);

        if($isset){

            // Devolver la imágen
            $file = \Storage::disk('users')->get($filename);

            return new Response($file,200);

        }else{
            $data = [
                'status'=>'error',
                'code'  =>404,
                'message'=>'La imágen no existe'
            ];
        }

        return response()->json($data,$data['code']);
    }

}
