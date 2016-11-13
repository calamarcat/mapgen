/**
 * Created by BlackCat on 12/11/2016.
 */

var Maps = function() {
    // var modes = ["Turf War", "Splat Zones", "Tower Control", "Rainmaker"];
    // var stages = ["Ancho-V Games", "Arowana Mall", "Blackbelly Skatepark", "Bluefin Depot", "Camp Triggerfish",
    //     "Flounder Heights‎", "Hammerhead Bridge", "Kelp Dome", "Mahi-Mahi Resort", "Moray Towers", "Museum d'Alfonsino",
    //     "Piranha Pit", "Port Mackerel", "Saltspray Rig", "Urchin Underpass", "Walleye Warehouse"];
    var modes;
    var stages;
    var maps = [];
    var weights;

    var getModes = function() {
        return modes;
    };

    var getStages = function() {
        return stages;
    };

    var getWeights = function() {
        return weights;
    };

    var createMaps = function() {
        weights = new Weights();

        modes = Object.keys(weights.modes);
        stages = Object.keys(weights.stages);

        var mapWeights = weights.maps;
        for (var mode in mapWeights) {
            if (mapWeights.hasOwnProperty(mode)) {
                var stageWeights = mapWeights[mode];
                for (var stage in stageWeights) {
                    if (stageWeights.hasOwnProperty(stage)) {
                        var map = new Map(mode, stage, stageWeights[stage]);
                        maps.push(map);
                    }
                }
            }
        }
    };

    var findMap = function(mode, stage) {
        if (mode === null && stage !== null) {
            return stages[stage];
        } else if (mode !== null && stage === null) {
            return modes[mode];
        } else if (mode !== null && stage !== null) {
            for (var map in maps) {
                if (maps.hasOwnProperty(map)) {
                    if (maps[map].mode == mode && maps[map].stage == stage) {
                        return maps[map];
                    }
                }
            }
        }
        console.log("Error: couldn't find map " + mode + " " + stage);
        return null;
    };

    var updateWeights = function(mode, stage, numRounds) {
        if (mode !== null) {
            var modeWeight = weights.modes[mode];
            weights.modes[mode] = modeWeight - (modeWeight / numRounds);
        }

        if (stage !== null) {
            var stageWeight = weights.stages[stage];
            weights.stages[stage] = stageWeight - (stageWeight / numRounds);
        }

        if (mode !== null && stage !== null) {
            var mapWeight = weights.maps[mode][stage];
            weights.maps[mode][stage] = mapWeight - (mapWeight / numRounds);
        }
    };

    var getModeWithProb = function(currentModes) {
        var mode = null;
        var count = 0;
        while (count < currentModes.length * 2) {
            mode = currentModes[Math.floor(Math.random() * currentModes.length)];
            var modeWeight = weights.modes[mode];
            var prob = Math.random();
            if (modeWeight > prob) {
                return mode;
            }
        }
        return mode;
    };

    var getStageWithProb = function(currentStages) {
        var stage = null;
        var count = 0;
        while (count < currentStages.length * 2) {
            stage = currentStages[Math.floor(Math.random() * currentStages.length)];
            var stageWeight = weights.stages[stage];
            var prob = Math.random();
            if (stageWeight > prob) {
                return stage;
            }
        }
        return stage;
    };

    var createSimpleMaps = function(modeList, stageList, numRounds) {
        var mapList = [];
        var currentModes = modeList.slice(0);
        var recentModes = [];
        var currentStages = stageList.slice(0);
        var recentStages = [];

        for (var r = 0; r < numRounds; r++) {
            // TODO: check at least one thing has been added!
            var mode = null;
            var stage = null;
            var count = 0;
            var map;
            while (count < 5) {
                var mapWeight = 0;
                var numWeights = 0;
                if (modeList.length > 0) {
                    mode = getModeWithProb(currentModes);
                    mapWeight += weights.stages[stage];
                    numWeights++;
                }
                if (stageList.length > 0) {
                    stage = getStageWithProb(currentStages);
                    mapWeight += weights.stages[stage];
                    numWeights++;
                }
                if (mode!== null && stage !== null) {
                    map = findMap(mode, stage);
                    mapWeight += map.weight;
                    numWeights++;
                } else {
                    map = new Map(mode, stage, mapWeight);
                }
                mapWeight = mapWeight/numWeights;

                var prob = Math.random() / 2;
                if (mapWeight > prob && checkSimpleMap(mapList, map, modeList.length, stageList.length)) {
                    break;
                }
                count++;
            }
            addMap(mapList, map, numRounds);

            recentModes.push(currentModes.splice(currentModes.indexOf(mode), 1));
            recentStages.push(currentStages.splice(currentStages.indexOf(stage), 1));
            updateLists(modeList, currentModes, recentModes);
            updateLists(stageList, currentStages, recentStages);

        }

        return mapList;
    };

    var createAdvancedMaps = function(inputMaps, modeList, numRounds) {
        var mapList = [];
        inputMaps = randomiseArray(inputMaps);

        while (mapList.length < numRounds) {
            var map;
            var count = 0;
            while (count < 5) {
                var idx = Math.floor(Math.random() * inputMaps.length);
                map = inputMaps[idx];

                var prob = Math.random() / 2;
                if (map.weight > prob && checkAdvancedMap(mapList, map, modeList, inputMaps.length)) {
                    break;
                }
                count++;
            }
            addMap(mapList, map, numRounds);
        }
        return mapList;
    };

    var randomiseArray = function(array) {
        for (var i = 0; i < array.length / 2; i++) {
            var idx1 = Math.floor(Math.random() * array.length);
            var idx2 = Math.floor(Math.random() * array.length);
            var temp = array[idx1];
            array[idx1] = array[idx2];
            array[idx2] = temp;
        }
        return array;
    };

    var checkSimpleMap = function(mapList, map, numModes, numStages) {
        var combos = numModes * numStages;
        var idx = Math.min(Math.floor(mapList.length / 2), mapList.length - Math.floor(combos / 2));
        var temp = mapList.slice(idx);
        return (temp.indexOf(map) > -1);
    };

    var checkAdvancedMap = function(mapList, map, modeList, combos) {
        if (mapList.length > 0) {
            var idx = Math.min(Math.floor(mapList.length / 2), mapList.length - Math.floor(combos / 2));
            var temp = mapList.slice(idx);

            var numModes = Object.keys(modeList).length;
            var numStages = modeList[map.mode];
            if (numModes > 1 && mapList[mapList.length - 1].mode === map.mode) {
                return false;
            }
            if (numStages > 1 && mapList[mapList.length - 1].stage === map.stage) {
                return false;
            }

            return (temp.indexOf(map) > -1);
        }
        return true;
    };

    var updateLists = function(fullList, currentList, recentList) {
        if (fullList.length > 0) {
            var minLength = Math.max(Math.ceil(fullList.length / 2), 1);
            if (currentList.length < minLength) {

                for (var i = 0; i < minLength; i++) {
                    currentList.push(recentList.shift());
                }
            }
        }
    };

    var addMap = function(mapList, map, numRounds) {
        updateWeights(map.mode, map.stage, numRounds);
        mapList.push(map);
    };

    return {
        createMaps: createMaps,
        getModes: getModes,
        getStages: getStages,
        getWeights: getWeights,
        createSimpleMaps: createSimpleMaps,
        createAdvancedMaps: createAdvancedMaps,
        findMap: findMap
    };

};


var Map = function(mode, stage, weight) {
    var name = mode === null ? "" : mode;
    name += " ";
    name += stage === null ? "" : stage;
    return {
        mode: mode,
        stage: stage,
        weight: weight,
        toString: name
    };
};