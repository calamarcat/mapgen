/**
 * Created by BlackCat on 12/11/2016.
 */
var UI = function(inputDivId, outputDivId) {
    var modeListId = "modeList";
    var stageListId = "stageList";

    var genSimpleMapOptions = function (maps) {
        var div = document.getElementById(inputDivId);
        var modes = maps.getModes();
        var stages = maps.getStages();

        // Get number of rounds
        var roundText = document.createElement("P");
        roundText.innerHTML = "Please enter the number of rounds: ";
        roundText.className = "helpText";
        div.appendChild(roundText);
        var rounds = document.createElement("INPUT");
        div.appendChild(rounds);

        // Help text
        var helpText = document.createElement("P");
        helpText.innerHTML = "Please select which modes and stages you want to include. If you don't select any modes " +
            "the algorithm will assume you only want randomise stages, and vice versa.";
        helpText.className = "helpText";
        div.appendChild(helpText);

        // Generate mode options
        var modeHeading = document.createTextNode("Match Modes:");
        modeHeading.className = "helpText";
        div.appendChild(modeHeading);

        var modeList = document.createElement("UL");
        modeList.id = modeListId;
        for (var mode in modes) {
            if (modes.hasOwnProperty(mode)) {
                var listItem = document.createElement("LI");
                var box = document.createElement("INPUT");
                box.type = "checkbox";
                box.name = "mode";
                box.value = modes[mode];
                var label = document.createTextNode(modes[mode]);
                listItem.appendChild(box);
                listItem.appendChild(label);
                modeList.appendChild(listItem);
            }
        }
        div.appendChild(modeList);

        // Generate stage options
        stageHeading = document.createTextNode("Match Stages:");
        stageHeading.className = "helpText";
        div.appendChild(stageHeading);

        var stageList = document.createElement("UL");
        stageList.id = stageListId;
        for (var stage in stages) {
            if (stages.hasOwnProperty(stage)) {
                var listItem = document.createElement("LI");
                var box = document.createElement("INPUT");
                box.type = "checkbox";
                box.name = "stage";
                box.value = stages[stage];
                var label = document.createTextNode(stages[stage]);
                listItem.appendChild(box);
                listItem.appendChild(label);
                stageList.appendChild(listItem);
            }
        }
        div.appendChild(stageList);

        // TODO: add way to add exceptions!

        // Add button to submit options
        var button = document.createElement("BUTTON");
        button.onclick = function() {
            var options = getSimpleMapOptions();
            // TODO: add input validation!
            var output = maps.createSimpleMaps(options.modeList, options.stageList, rounds.value);
            return outputMaps(output);
        };
        button.appendChild(document.createTextNode("Submit"));
        div.appendChild(button);

    };

    var getSimpleMapOptions = function() {
        // Get modes
        var modes = document.getElementById(modeListId).getElementsByTagName("INPUT");
        var modeList = [];
        for (var mode in modes) {
            if (modes.hasOwnProperty(mode) && modes[mode].checked) {
                modeList.push(modes[mode].value);
            }
        }

        // Get stages
        var stages = document.getElementById(stageListId).getElementsByTagName("INPUT");
        var stageList = [];
        for (var stage in stages) {
            if (stages.hasOwnProperty(stage) && stages[stage].checked) {
                stageList.push(stages[stage].value);
            }
        }

        return {
            modeList: modeList,
            stageList: stageList
        }
    };

    var genAdvancedMapOptions = function (maps) {
        var div = document.getElementById(inputDivId);
        var modes = maps.getModes();
        var stages = maps.getStages();
        var weights = maps.getWeights();

        // Get number of rounds
        var roundText = document.createElement("P");
        roundText.innerHTML = "Please enter the number of rounds: ";
        roundText.className = "helpText";
        div.appendChild(roundText);
        var rounds = document.createElement("INPUT");
        div.appendChild(rounds);

        // Help text
        var helpText = document.createElement("P");
        helpText.innerHTML = "Please add weights to select modes. Maps with weight 0 will not be selected, and the " +
            "higher the value the more often the map/mode combination will appear. The default values are based on how" +
            "often the maps were chosen in ranked over this year.";
        helpText.className = "helpText";
        div.appendChild(helpText);

        // Generate mode options
        for (var mode in modes) {
            if (modes.hasOwnProperty(mode)) {
                var modeListDiv = document.createElement("DIV");
                modeListDiv.className = "modeListDiv";
                var modeListName = document.createElement("P");
                modeListName.innerHTML = modes[mode];
                modeListName.className = "helpText";
                modeListDiv.appendChild(modeListName);

                var modeList = document.createElement("UL");
                modeList.id = "modesList";
                modeList.className = "modeList";

                for (var stage in stages) {
                    if (stages.hasOwnProperty(stage)) {
                        // Generate stage options
                        var listItem = document.createElement("LI");
                        var box = document.createElement("INPUT");
                        box.name = stages[stage];
                        box.maxlength = 4;
                        box.size = 4;
                        box.value = weights.maps[modes[mode]][stages[stage]];
                        var label = document.createTextNode(stages[stage]);
                        listItem.appendChild(box);
                        listItem.appendChild(label);
                        modeList.appendChild(listItem);
                    }
                }
                modeListDiv.appendChild(modeList);
                div.appendChild(modeListDiv);
            }
        }

        // Add button to submit options
        var button = document.createElement("BUTTON");
        button.onclick = function() {
            var options = getAdvancedMapOptions(maps);
            // TODO: add input validation!
            var output = maps.createAdvancedMaps(options.outputMaps, options.modeList, rounds.value);
            return outputMaps(output);
        };
        button.appendChild(document.createTextNode("Submit"));
        div.appendChild(button);

    };

    var getAdvancedMapOptions = function(maps) {
        var mapModes = maps.getModes();
        var outputMaps = [];
        var modeList = {};

        // Get mode lists
        var modes = document.getElementsByClassName("modeList");
        for (var mode in modes) {
            if (modes.hasOwnProperty(mode)) {
                var stages = modes[mode].getElementsByTagName("INPUT");
                for (var stage in stages) {
                    if (stages.hasOwnProperty(stage)) {
                        if (stages[stage].value > 0) {
                            var map = maps.findMap(mapModes[mode], stages[stage].name);
                            map.weight = stages[stage].value;
                            outputMaps.push(map);

                            if (modeList[mapModes[mode]] === undefined) {
                                modeList[mapModes[mode]] = 0
                            }
                            modeList[mapModes[mode]] += 1;
                        }
                    }
                }
            }
        }
        return {
            outputMaps: outputMaps,
            modeList: modeList
        };
    };

    var outputMaps = function(maps) {
        var outputDiv = document.getElementById(outputDivId);
        outputDiv.innerHTML = "";

        var mapListHeading = document.createElement("P");
        mapListHeading.innerHTML = "Maps:";
        mapListHeading.className = "helpText";
        outputDiv.appendChild(mapListHeading);

        var mapList = document.createElement("OL");

        for (var map in maps) {
            if (maps.hasOwnProperty(map)) {
                var listItem = document.createElement("LI");
                listItem.innerHTML = maps[map].toString;
                mapList.appendChild(listItem);
            }
        }
        outputDiv.appendChild(mapList);
    };

    return {
        genSimpleMapOptions: genSimpleMapOptions,
        genAdvancedMapOptions: genAdvancedMapOptions
    };

};