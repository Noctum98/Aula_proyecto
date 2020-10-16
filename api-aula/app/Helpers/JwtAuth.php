<?php

use Firebase\JWT\JWT;
use Illuminate\Support\Facades\DB;
use App\User;

class JwtAuth{
    public $key = "1234567";
    
    public function signup($email,$password,$getToken = false){
        // Buscar si existe el usuario con esas credenciales
        $user = User::where([
            'email'=>$email
        ])->first();
        
        //Si encuentra el usuario comprobamos la contraseña
        if($user){
            $verify = password_verify($password,$user->password);

            if($verify){
                $token = [
                    'sub'       =>  $user->id,
                    'name'      =>  $user->name,
                    'surname'   =>  $user->surname,
                    'email'     =>  $user->email,
                    'image'     =>  $user->image,
                    'iat'       =>  time(),
                    'exp'       =>  time() + (3*24*60*60)
                ];

                $jwt = JWT::encode($token,$this->key,'HS256');
                $decode = JWT::decode($jwt,$this->key,['HS256']);

                if($getToken){
                    $data = $decode;
                }else{
                    $data = $jwt;
                }

            }else{
                $data = [
                    'status'=>'error',
                    'message' =>'La contraseña es incorrecta'
                ];
            }
        }else{
            $data = [
                'status' => 'error',
                'message' => 'El usuario no existe'
            ];
        }


        return $data;
    }

    public function checkToken($jwt,$getToken = false){

        $auth = false;

        try {
            $decoded = JWT::decode($jwt,$this->key,['HS256']);
        } catch (\UnexpectedValueException $e) {
            $auth = false;
        } catch(\DomainException $e){
            $auth = false;
        }

        if(!empty($decoded) && is_object($decoded) && isset($decoded->sub)){
            $auth = true;
        }

        if($getToken){
            $auth = $decoded;
        }

        return $auth;
    }
}
