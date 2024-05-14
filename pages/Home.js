import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import { FlatList, View, Image, TouchableOpacity, StyleSheet, Text, Button } from "react-native";
import { fire, storage } from '../firebase';
import { onSnapshot, collection, addDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";


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
        () => {

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

async function pickImage(){
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImg(result.assets[0].uri);
      await uploadImage(result.assets[0].uri, "image")
    }
  };

return (
    <View style={estilo.container} >


        <Text style={estilo.titulo}>
            Minhas fotos Lindas
            </Text>
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

        <TouchableOpacity
        onPress={pickImage}
        style={estilo.imgpick}>
            <Text style={estilo.button}>Images</Text>
        </TouchableOpacity>
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
    },
    titulo:{
        fontSize: 35,
        marginTop: 100
    },
    imgpick:{
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20
    },
    button: {
        fontSize: 30,
        marginTop: 50
    }
})
