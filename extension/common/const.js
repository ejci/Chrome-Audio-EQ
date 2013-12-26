/**
 * Constants shared across extension
 * TODO: build process to include constant in *.js
 */

var CONST = {};
/**
 * EQ default values
 */
CONST.EQ = [{
    label : 'master',
    gain : 1
}, {
    label : '32',
    f : 32,
    gain : 0,
    type : 3
}, {
    label : '64',
    f : 64,
    gain : 0,
    type : 5
}, {
    label : '125',
    f : 125,
    gain : 0,
    type : 5
}, {
    label : '250',
    f : 250,
    gain : 0,
    type : 5
}, {
    label : '500',
    f : 500,
    gain : 0,
    type : 5
}, {
    label : '1k',
    f : 1000,
    gain : 0,
    type : 5
}, {
    label : '2k',
    f : 2000,
    gain : 0,
    type : 5
}, {
    label : '4k',
    f : 4000,
    gain : 0,
    type : 5
}, {
    label : '8k',
    f : 8000,
    gain : 0,
    type : 5
}, {
    label : '16k',
    f : 16000,
    gain : 0,
    type : 4
}];
CONST.CONFIG = {
    snap : false,
    mono : false
};
PRESETS = [];
PRESETS.push({
    name : 'none',
    gains : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
});
PRESETS.push({
    name : 'Acoustic',
    gains : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
});
PRESETS.push({
    name : 'Bass Booster',
    gains : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
});
PRESETS.push({
    name : 'Bass Reducer',
    gains : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
});
PRESETS.push({
    name : 'Classical',
    gains : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
});
PRESETS.push({
    name : 'Dance',
    gains : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
});
PRESETS.push({
    name : 'Deep',
    gains : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
});
PRESETS.push({
    name : 'Electronic',
    gains : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
});
PRESETS.push({
    name : 'Flat',
    gains : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
});
PRESETS.push({
    name : 'Hip-Hop',
    gains : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
});
PRESETS.push({
    name : 'Jazz',
    gains : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
});
PRESETS.push({
    name : 'Latin',
    gains : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
});
PRESETS.push({
    name : 'Loudness',
    gains : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
});
PRESETS.push({
    name : 'Lounge',
    gains : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
});
PRESETS.push({
    name : 'Piano',
    gains : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
});
PRESETS.push({
    name : 'Pop',
    gains : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
});
PRESETS.push({
    name : 'R&B',
    gains : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
});
PRESETS.push({
    name : 'Rock',
    gains : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
});
PRESETS.push({
    name : 'Small Speakers',
    gains : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
});
PRESETS.push({
    name : 'Spoken Word',
    gains : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
});
PRESETS.push({
    name : 'Treble Booster',
    gains : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
});
PRESETS.push({
    name : 'Treble Reducer',
    gains : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
});
PRESETS.push({
    name : 'Vocal Booster',
    gains : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
});
