import requests
import json
import os

# ID d'une grosse playlist Rap FR sur Deezer 
# (ex: "Rap FR" ou "Classiques Rap Francais")
PLAYLIST_ID = "15951169843"
API_URL = f"https://api.deezer.com/playlist/{PLAYLIST_ID}"

def fetch_songs():
    print(f"Connexion à l'API Deezer (Playlist {PLAYLIST_ID})...")
    response = requests.get(API_URL)
    
    if response.status_code != 200:
        print("Erreur : Impossible de joindre l'API.")
        return []
        
    data = response.json()
    tracks = data.get("tracks", {}).get("data", [])
    
    songs_db = []
    seen_tracks = set() # Le registre anti-doublons
    
    for track in tracks:
        if track.get("preview"):
            title = track["title"]
            artist = track["artist"]["name"]
            
            # Création d'une clé unique, tout en minuscules pour éviter la casse
            unique_key = f"{title.lower().strip()} - {artist.lower().strip()}"
            
            # Si cette clé n'a pas encore été vue, on l'ajoute
            if unique_key not in seen_tracks:
                seen_tracks.add(unique_key)
                song = {
                    "id": track["id"],
                    "title": title,
                    "artist": artist,
                    "cover": track["album"]["cover_xl"],
                    "audio": track["preview"]
                }
                songs_db.append(song)
            else:
                print(f"Doublon ignoré : {title} - {artist}")
                
    return songs_db

def generate_js_file(songs):
    # Sécurité : s'assure que l'arborescence existe bien
    os.makedirs("assets/js", exist_ok=True)
    filepath = "assets/js/data.js"
    
    # Formatage de la donnée en module JavaScript pur
    js_content = f"export const songsDB = {json.dumps(songs, indent=4, ensure_ascii=False)};\n"
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(js_content)
        
    print(f"Succès ! {len(songs)} musiques ont été nettoyées et exportées dans {filepath}")

if __name__ == "__main__":
    songs = fetch_songs()
    if songs:
        generate_js_file(songs)
    else:
        print("Erreur : 0 musique récupérée. L'ID de la playlist est invalide ou privée.")