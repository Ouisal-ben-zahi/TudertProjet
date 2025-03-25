<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LigneCommande;
use App\Models\Produite;
use Illuminate\Support\Facades\Auth;

class LigneCommandeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ligneCommandes = LigneCommande::all();
        $produites = Produite::all();
        
        return response()->json([
            "ligneCommandes" => $ligneCommandes,
            "produites" => $produites
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $ligneCommande = new LigneCommande();
            $ligneCommande->id_produit = $request->id_produit;
            $ligneCommande->quantité = $request->quantité;
            $ligneCommande->id_utilisateur = Auth::id();
            $ligneCommande->save();
    
            return response()->json($ligneCommande);
        } catch (\Throwable $th) {
            return response()->json($th);
        }
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
        $ligneCommande = LigneCommande::findOrFail($id);
        $ligneCommande->quantité = $request->quantité;
        $ligneCommande->save();

        return response()->json($ligneCommande);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}