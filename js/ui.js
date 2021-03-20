/**
 * Created by BlackCat on 12/11/2016.
 */
var UI = function(inputDivId, outputDivId) {
    var modeListId = "modeList";
    var stageListId = "stageList";

    var genRoundsOptions = function(parent) {
        var roundMaps = document.createElement("DIV");
        roundMaps.id = "roundMapsDiv";
        var roundText = document.createElement("P");
        roundText.innerHTML = "Please enter the number of rounds and maps per round. ";
        roundText.className = "helpText";
        roundMaps.appendChild(roundText);

        roundMaps.appendChild(document.createTextNode("Rounds: "));
        var rounds = document.createElement("INPUT");
        rounds.maxLength = 4;
        rounds.size = 4;
        roundMaps.appendChild(rounds);

        roundMaps.appendChild(document.createElement("BR"));

        roundMaps.appendChild(document.createTextNode("Games per round: "));
        var maps = document.createElement("INPUT");
        maps.maxLength = 4;
        maps.size = 4;
        roundMaps.appendChild(maps);

        parent.appendChild(roundMaps);

        return {
            maps: maps,
            rounds: rounds
        };
    };

    var genSimpleMapOptions = function (maps) {
        var div = document.getElementById(inputDivId);
        var modes = maps.getModes();
        var stages = maps.getStages();

        var roundMaps = genRoundsOptions(div);

        var mapSelectDiv = document.createElement("DIV");
        mapSelectDiv.id = "mapSelectDiv";

        // Help text
        var helpText = document.createElement("P");
        helpText.innerHTML = "Please select which modes and stages you want to include. If you don't select any modes " +
            "the algorithm will assume you only want randomise stages, and vice versa.";
        helpText.className = "helpText";
        mapSelectDiv.appendChild(helpText);

        // Generate mode options
        var modeHeading = document.createElement("P");
        modeHeading.innerHTML = "Modes:";
        modeHeading.className = "helpText listHeading";
        mapSelectDiv.appendChild(modeHeading);

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
        mapSelectDiv.appendChild(modeList);

        // Generate stage options
        var stageHeading = d = document.createElement("P");
        stageHeading.innerHTML = "Stages:";
        stageHeading.className = "helpText listHeading";
        mapSelectDiv.appendChild(stageHeading);

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
        mapSelectDiv.appendChild(stageList);

        // Add button to submit options
        var button = document.createElement("BUTTON");
        button.onclick = function() {
            var options = getSimpleMapOptions();
            var output = maps.createSimpleMaps(options.modeList, options.stageList, roundMaps.rounds.value * roundMaps.maps.value);
            return outputMaps(output);
        };
        button.appendChild(document.createTextNode("Submit"));
        mapSelectDiv.appendChild(button);

        div.appendChild(mapSelectDiv);

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

        var roundMaps = genRoundsOptions(div);

        var mapSelectDiv = document.createElement("DIV");
        mapSelectDiv.id = "mapSelectDiv";

        // Help text
        var helpText = document.createElement("P");
        helpText.innerHTML = "Please add weights to select modes. Maps with weight 0 will not be selected, and the " +
            "higher the value the more often the map/mode combination will appear. The default values are based on how" +
            "often the maps were chosen in ranked over this year.";
        helpText.className = "helpText";
        mapSelectDiv.appendChild(helpText);

        var optionTable = document.createElement("TABLE");
        var modeHeadings = document.createElement("THEAD");
        var corner = document.createElement("TH");
        corner.innerHTML = " ";
        modeHeadings.appendChild(corner);

        for (var mode in modes) {
            if (modes.hasOwnProperty(mode)) {
                var colHeading = document.createElement("TH");

                var defaultLink = document.createElement("SPAN");
                defaultLink.innerHTML = "Defaults";
                defaultLink.className = "modeShortcut modeDefault";
                defaultLink.onclick = (function(mode, maps) {
                    return function() {
                        setAllMode("default", mode, maps);
                    };
                })(mode, maps);

                var equalLink = document.createElement("SPAN");
                equalLink.innerHTML = "Equal";
                equalLink.className = "modeShortcut modeEqual";
                equalLink.onclick = (function(mode, maps) {
                    return function() {
                        setAllMode(1, mode, maps);
                    };
                })(mode, maps);
                var noneLink = document.createElement("SPAN");
                noneLink.innerHTML = "None";
                noneLink.className = "modeShortcut modeNone";
                noneLink.onclick = (function(mode, maps) {
                    return function() {
                        setAllMode(0, mode, maps);
                    };
                })(mode, maps);

                var content = document.createElement("P");
                var name = document.createElement("SPAN");
                name.innerHTML = modes[mode];
                name.className = "thName";
                content.appendChild(name);
                content.appendChild(document.createElement("BR"));
                content.appendChild(document.createTextNode("("));
                content.appendChild(defaultLink);
                content.appendChild(document.createTextNode(" / "));
                content.appendChild(equalLink);
                content.appendChild(document.createTextNode(" / "));
                content.appendChild(noneLink);
                content.appendChild(document.createTextNode(")"));
                colHeading.appendChild(content);

                modeHeadings.appendChild(colHeading);
            }
        }
        optionTable.appendChild(modeHeadings);

        // Create table with stage headings
        for (var stage in stages) {
            if (stages.hasOwnProperty(stage)) {
                var row = document.createElement("TR");
                var rowHeading = document.createElement("TH");

                var defaultLink = document.createElement("SPAN");
                defaultLink.innerHTML = "Defaults";
                defaultLink.className = "modeShortcut modeDefault";
                defaultLink.onclick = (function(stage, maps) {
                    return function() {
                        setAllStage("default", stage, maps);
                    };
                })(stage, maps);

                var equalLink = document.createElement("SPAN");
                equalLink.innerHTML = "Equal";
                equalLink.className = "modeShortcut modeEqual";
                equalLink.onclick = (function(stage, maps) {
                    return function() {
                        setAllStage(1, stage, maps);
                    };
                })(stage, maps);
                var noneLink = document.createElement("SPAN");
                noneLink.innerHTML = "None";
                noneLink.className = "modeShortcut modeNone";
                noneLink.onclick = (function(stage, maps) {
                    return function() {
                        setAllStage(0, stage, maps);
                    };
                })(stage, maps);

                var content = document.createElement("P");
                var name = document.createElement("SPAN");
                name.innerHTML = stages[stage];
                name.className = "thName";
                content.appendChild(name);
                content.appendChild(document.createElement("BR"));
                content.appendChild(document.createTextNode("("));
                content.appendChild(defaultLink);
                content.appendChild(document.createTextNode(" / "));
                content.appendChild(equalLink);
                content.appendChild(document.createTextNode(" / "));
                content.appendChild(noneLink);
                content.appendChild(document.createTextNode(")"));

                rowHeading.appendChild(content);

                row.appendChild(rowHeading);

                for (var mode in modes) {
                    if (modes.hasOwnProperty(mode)) {
                        var cell = document.createElement("TD");
                        var box = document.createElement("INPUT");
                        box.name = stages[stage];
                        box.maxlength = 4;
                        box.size = 4;
                        box.value = weights.maps[modes[mode]][stages[stage]];
                        cell.appendChild(box);
                        row.appendChild(cell);
                    }
                }
                optionTable.appendChild(row);
            }
        }
        mapSelectDiv.appendChild(optionTable);

        // Add button to submit options
        var button = document.createElement("BUTTON");
        button.onclick = function() {
            var options = getAdvancedMapOptions(maps);
            var output = maps.createAdvancedMaps(options.outputMaps, options.modeList, roundMaps.rounds.value * roundMaps.maps.value);
            return outputMaps(output);
        };
        button.appendChild(document.createTextNode("Submit"));
        mapSelectDiv.appendChild(button);

        div.appendChild(mapSelectDiv);

    };

    var getAdvancedMapOptions = function(maps) {
        var mapModes = maps.getModes();
        var mapStages = maps.getStages();
        var outputMaps = [];
        var modeList = {};

        // Get mode lists
        var stages = document.getElementsByTagName("TABLE")[0].getElementsByTagName("TR");
        for (var stage in stages) {
            if (stages.hasOwnProperty(stage)) {
                var modes = stages[stage].getElementsByTagName("INPUT");
                for (var mode in modes) {
                    if (modes.hasOwnProperty(mode)) {
                        var map = maps.findMap(mapModes[mode], mapStages[stage]);
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

        return {
            outputMaps: outputMaps,
            modeList: modeList
        };
    };

    var setAllMode = function(value, modeIdx, maps) {
        var modes = maps.getModes();
        var stages = maps.getStages();
        var weights = maps.getWeights();

        var table = document.getElementsByTagName("TABLE")[0];
        var rows = table.getElementsByTagName("TR");
        for (var row in rows) {
            if (rows.hasOwnProperty(row)) {
                var cells = rows[row].getElementsByTagName("INPUT");
                if (value === "default") {
                    cells[modeIdx].value = weights.maps[modes[modeIdx]][stages[row]];
                } else {
                    cells[modeIdx].value = value;
                }
            }
        }
    };

    var setAllStage = function(value, stageIdx, maps) {
        var modes = maps.getModes();
        var stages = maps.getStages();
        var weights = maps.getWeights();

        var table = document.getElementsByTagName("TABLE")[0];
        var rows = table.getElementsByTagName("TR");
        var cells = rows[stageIdx].getElementsByTagName("INPUT");
        for (var c = 0; c < cells.length; c++) {
            if (value === "default") {
                cells[c].value = weights.maps[modes[c]][stages[stageIdx]];
            } else {
                cells[c].value = value;
            }
        }
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