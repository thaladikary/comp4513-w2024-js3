import { Play, Act, Scene } from "./play-module.js";

document.addEventListener("DOMContentLoaded", function () {
  const LIST_OF_PLAYS = ["Hamlet", "Julius Caesar"];
  const API_URL =
    "https://www.randyconnolly.com//funwebdev/3rd/api/shakespeare/play.php";
  let queryString = "";
  let playData = [];

  /*
     To get a specific play, add play name via query string, 
	   e.g., url = url + '?name=hamlet';
	 
	 https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=hamlet
	 https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=jcaesar
     
   */
  let playSelector = document.querySelector("#playList");
  let actSelector = document.querySelector("#actList");
  let sceneSelector = document.querySelector("#sceneList");
  let playerSelector = document.querySelector("#playerList");
  let playHereSection = document.querySelector("#playHere");
  let actHereArticle = document.querySelector("#actHere");
  populatePlaySelector(LIST_OF_PLAYS);
  document.querySelector("#playList").addEventListener("change", (e) => {
    queryString = e.target.value.toLowerCase();
    if (queryString === "julius caesar") {
      queryString = "jcaesar";
    }
    fetchPlay(queryString, API_URL);
  });

  async function fetchPlay(queryString, url) {
    const reponse = await fetch(url + `?name=${queryString}`);
    const jsonResp = await reponse.json();

    populateActSelector(jsonResp, actSelector);
    populatePlayersSelector(jsonResp);
    listenForActChange(jsonResp); //for changing scene options depending on selected act
    renderPlayTitle(jsonResp.title);
    renderActInformation(jsonResp);
  }

  async function renderActInformation(data) {
    //<h3>Act name here</h3>
    let listOfActs = [];

    for (const act of data.acts) {
      let newAct = new Act(act.name);
      listOfActs.push(newAct);
    }
    let newPlay = new Play(listOfActs);
    console.log(listOfActs);
  }

  function renderPlayTitle(title) {
    removeChildren(playHereSection);
    let h2Title = document.createElement("h2");
    h2Title.appendChild(document.createTextNode(title));
    playHereSection.appendChild(h2Title);
  }

  function listenForActChange(data) {
    actSelector.addEventListener("change", (e) => {
      const selectedAct = e.target.value;
      populateSceneSelector(data, selectedAct);
    });
  }

  //to populate the act selector options
  function populateActSelector(data, actSelector) {
    removeChildren(actSelector);
    for (const act of data.acts) {
      const option = document.createElement("option");
      option.value = act.name;
      option.textContent = act.name;
      actSelector.appendChild(option);
    }
  }

  //populate scene selector based on what act is currently selected

  function populateSceneSelector(data, selectedAct) {
    removeChildren(sceneSelector);

    //  saech for the currently selected act in the list of acts
    const sceneDataForSelectedAct = data.acts.find(
      (act) => act.name === selectedAct
    );
    for (const scene of sceneDataForSelectedAct.scenes) {
      //create scene option element for each scene in list
      const option = document.createElement("option");
      option.value = scene.name;
      option.textContent = scene.name;
      sceneSelector.appendChild(option);
    }
  }

  function populatePlayersSelector(data) {
    removeChildren(playerSelector);
    for (const player of data.persona) {
      const option = document.createElement("option");
      option.value = player.player;
      option.textContent = player.player;
      playerSelector.appendChild(option);
    }
  }

  function removeChildren(element) {
    //removes existing children so items will not stack
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function populatePlaySelector(listOfPlays) {
    playSelector.appendChild(document.createElement("option")); //default empty option
    listOfPlays.forEach((play) => {
      let optionNode = document.createElement("option");
      let textNode = document.createTextNode(play);
      textNode.value = play;
      optionNode.appendChild(textNode);
      playSelector.appendChild(optionNode);
    });
  }
});
