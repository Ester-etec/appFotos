import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import { FlatList, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { fire, storage } from '../firebase';
import { onSnapshot, collection, addDoc } from "firebase/firestore";


export default function Home(){
    const [img,setImg] = useState("");
    const [file,setFile] = useState("");

useEffect(()=>{

    const unsubscribe = onSnapshot(collection(fire,"files"),(snapshot)=>{
        snapshot.docChanges().forEach((change)=>{
            if(change.type === "added"){
                setFile((prevFiles) => [...prevFiles, change.doc.data()]);
            }
        });
    });
    return () => unsubscribe();
}, []);

async function uploadImage(uri, fileType){
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, "");
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
        "state_changed",
        (snapshot) => {

            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                await saveRecord(fileType, downloadURL, new Date().toISOString());
                setImg("");
            });

        }
    )
}

async function saveRecord(fileType, url, createdAt){
    try{
        const docRef = await addDoc(collection,(fire,"files"),{
            fileType,
            url,
            createdAt
        })
    }catch(e){
        console.log(e);
    }
}

return (
    <View style={estilo.container} >

        <Text>Minhas fotos Lindas</Text>
        <FlatList
        data={file}
        keyExtractor={(item)=>item.url}
        renderItem={({item}) =>{
            if(item.fileType === "img"){

                return(
                    <Image
                       source={{uri:item.url}}
                       style={estilo.fotos}
                    />
                )

            }
        }
    
    }
    numColumns={2}        
        />

    </View>
)

}

const estilo = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fotos: {
        width: 200,
        height: 200
    }
})
