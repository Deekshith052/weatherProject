const { log } = require("console");
const express=require("express");
const https=require("https");
const ejs=require("ejs")
const bodyParser=require("body-parser")
const app=express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/",function(req,res){
    res.render("home")
})

app.post("/",function(req,res){
    var city=req.body.cityname;
    var checked=req.body.location;
    var url;
    if(checked=="on"){
        url="https://api.openweathermap.org/data/2.5/forecast?q=dehli&appid=069d2585263796b3ba092ff4041cd12f&units=metric"
        console.log(url)
    }
    else if(checked){
        url="https://api.openweathermap.org/data/2.5/forecast?lat="+checked.substring(0,10)+"&lon="+checked.substring(11)+"&appid=069d2585263796b3ba092ff4041cd12f&units=metric"
        console.log(url)

    }
    else{
        url="https://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid=069d2585263796b3ba092ff4041cd12f"
        console.log(url)
    }
    
    

    https.get(url,function(response){
        console.log(response.statusCode);
        if(response.statusCode==200){
            let chunk=[]


        response.on("data",function(data){
            chunk.push(data);
        }).on('end',function(){
        let data=Buffer.concat(chunk);
        const whetherdata=JSON.parse(data);
        console.log(whetherdata)
        const arr=[];
        var j=0;

        
        for(var i=0;i<6;i++){
            arr[i]={
                date:whetherdata.list[j].dt_txt.substring(0,10),
                temp:whetherdata.list[j].main.temp,
                humid:whetherdata.list[j].main.humidity,
                desc:whetherdata.list[j].weather[0].description,
                wind:whetherdata.list[j].wind.speed
            }
            j=j+8;
            if(j===whetherdata.list.length){
                j=j-1
            }
        }
        console.log(arr)
        const  temp=whetherdata.list[0].main.temp;
        const humid=whetherdata.list[0].main.humidity;
        const wind=whetherdata.list[0].wind.speed;
        const whetherdescription=whetherdata.list[0].weather[0].description;
        res.render("index",{data:arr});
    
    // else{
    //     res.render("error")
    // }

    })
    }
    else{
        res.render("error")
    }
        // changes
        
})
})




app.listen(3000,function(){
    console.log("server started at port 3000");
})
