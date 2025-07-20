//jab pura dom content load ho jayega uske baad hum niche diye hue function me chle jayenge
document.addEventListener("DOMContentLoaded",function(){

    const searchButton=document.getElementById("search-button");
    const usernameInput=document.getElementById("user-input");
    const statsContainer=document.querySelector(".stats-container");
    const easyProgressCircle=document.querySelector(".easy-progress");
    const mediumProgressCircle=document.querySelector(".medium-progress");
    const hardProgressCircle=document.querySelector(".hard-progress");
    const easyLabel=document.getElementById("easy-label");
    const mediumLabel=document.getElementById("medium-label");
    const hardLabel=document.getElementById("hard-label");
    const cardStatsContainer=document.querySelector(".stats-cards");

//return true or false based on regex
    function validateUsername(username){
       if(username.trim()===""){
        alert("Username should not be empty");
        return false;
       }
       const regex=/^[a-zA-z0-9_-]{1,15}$/;
       const isMatching=regex.test(username);
       if(!isMatching){
        alert("Invalid Username");
       }
       return isMatching;
    }
    
    async function fetchUserDetails(username){
      

      
      try{
        searchButton.textContent="Searching...";
        searchButton.disabled=true;
        
        // const response=await fetch(url);
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/' 
        const targetUrl = 'https://leetcode.com/graphql/';
            
        const myHeaders = new Headers();
        myHeaders.append("content-type", "application/json");

        const graphql = JSON.stringify({
            query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
            variables: { "username": `${username}` }
        })
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: graphql,
        };

        const response = await fetch(proxyUrl+targetUrl, requestOptions);

        // const res = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`);
        if(!response.ok) {
            throw new Error("Unable to fetch the User details");
        }
        
        const parseddata=await response.json();
    //     const parseddata = {
    //   easySolved: 120,
    //   mediumSolved: 75,
    //   hardSolved: 15,
    //   totalEasy: 200,
    //   totalMedium: 150,
    //   totalHard: 50
    // };
        console.log("Logging data: ",parseddata);
        displayUserData(parseddata);
      }

      catch(error){
        statsContainer.innerHTML=`<p>No data Found</p>`
      }
      finally{
        searchButton.textContent="Search";
        searchButton.disabled=false;
      }
    }
    
    function updateProgress(solved,total,label,circle){
        const progressDegree=(solved/total)*100;
        circle.style.setProperty("--progress-degree",`${progressDegree}%`);
        label.textContent=`${solved}/${total}`;
    }

    // function updateProgress(solved, total, label, circle){
    // const percent = total > 0 ? (solved / total) * 100 : 0;
    // circle.style.setProperty("--progress-degree", `${percent}%`);
    // label.textContent = `${solved}/${total}`;
    // }

    function displayUserData(parseddata){
        const totalQues=parseddata.data.allQuestionsCount[0].count;
        const totalEasyQues=parseddata.data.allQuestionsCount[1].count;
        const totalMediumQues=parseddata.data.allQuestionsCount[2].count;
        const totalHardQues=parseddata.data.allQuestionsCount[3].count;

        const solvedTotalQues=parseddata.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedTotalEasyQues=parseddata.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedTotalMediumQues=parseddata.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedTotalHardQues=parseddata.data.matchedUser.submitStats.acSubmissionNum[3].count;
 
        updateProgress(solvedTotalEasyQues,totalEasyQues,easyLabel,easyProgressCircle);
        updateProgress(solvedTotalMediumQues,totalMediumQues,mediumLabel,mediumProgressCircle);
        updateProgress(solvedTotalHardQues,totalHardQues,hardLabel,hardProgressCircle);

        const cardsdata=[
            {label:"Overall Submissions", value:parseddata.data.matchedUser.submitStats.totalSubmissionNum[0].submissions},
            {label:"Overall Easy Submissions", value:parseddata.data.matchedUser.submitStats.totalSubmissionNum[1].submissions},
            {label:"Overall Medium Submissions", value:parseddata.data.matchedUser.submitStats.totalSubmissionNum[2].submissions},
            {label:"Overall Hard Submissions", value:parseddata.data.matchedUser.submitStats.totalSubmissionNum[3].submissions},
        ];
        
        console.log("card ka data: ",cardsdata);

        cardStatsContainer.innerHTML=cardsdata.map(
            data=>{
                return `
                   <div class="card">
                        <h4>${data.label}</h4>
                        <p>${data.value}</p>
                  </div>
                `
            
            }
        ).join("");

    }

    // function displayUserData(data){
    // const { easySolved, mediumSolved, hardSolved, totalEasy, totalMedium, totalHard } = data;

    // updateProgress(easySolved, totalEasy, easyLabel, easyProgressCircle);
    // updateProgress(mediumSolved, totalMedium, mediumLabel, mediumProgressCircle);
    // updateProgress(hardSolved, totalHard, hardLabel, hardProgressCircle);
    // }


    searchButton.addEventListener('click',function(){
        const username=usernameInput.value;
        console.log("logggin username: ",username);
        if(validateUsername(username)){
            fetchUserDetails(username);
        }
    })
})