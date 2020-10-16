<?php

namespace App\Http\Middleware;

use Closure;

class ApiAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        // Recoger los datos y cabeceras
        $token = $request->header('Authorization');

        $jwtAuth = new \JwtAuth();
        $checkToken = $jwtAuth->checkToken($token);


        if($checkToken){
            return $next($request);
        }else{
            $data = [
                'status' => 'error',
                'code'  => 404,
                'message' => 'Eltoken no es válido'
            ];

            return response()->json($data,$data['code']);
        }
        
    }
}
