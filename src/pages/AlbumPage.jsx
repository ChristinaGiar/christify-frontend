import {
    useLoaderData
} from "react-router-dom";
import Track from "../components/Track";

function AlbumPage() {
    const album = useLoaderData();
    console.log(album);

    return (
        <>
        <h2>{album.name}</h2>
        <img src={album.image.url} alt={album.name} />
        {album.tracks.map(track =>
            <Track
            key={track.trackID}
            name={track.name}
            trackID={track.trackID}
            song={track.song}
            album={track.album}
            image={track.image?.url}
            />
            )}
        </>

    )
}

export default AlbumPage