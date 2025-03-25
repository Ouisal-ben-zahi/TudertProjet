<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\produite;
use Illuminate\Http\Request;

class ProduitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $produits = Produite::all()->map(function ($produit) {
            return [
                'id' => $produit->id,
                'nom' => $produit->nom,
                'prix' => $produit->prix,
                'description' => $produit->description,
                'image' => asset('storage/' . $produit->image),
            ];
        });

        return response()->json($produits);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
    public function getProductImage($filename)
    {
        return response()->json(['success' => 'you are here']);
        $path = storage_path('app/public/images/' . $filename);
        if (!file_exists($path)) {
            return response()->json(['error' => 'Image not found'], 404);
        }
        return response()->file($path);
    }
}
