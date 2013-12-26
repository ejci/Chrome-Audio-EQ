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
    name : 'None',
    gains : [0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000]
});
PRESETS.push({
    name : 'Classical',
    gains : [-0.0000, -0.0000, -0.0000, -0.0000, -0.0000, -0.0000, -4.3200, -4.3200, -4.3200, -5.7600]
});
PRESETS.push({
    name : 'Club',
    gains : [-0.0000, -0.0000, 4.8000, 3.3600, 3.3600, 3.3600, 1.9200, -0.0000, -0.0000, -0.0000]
});
PRESETS.push({
    name : 'Dance',
    gains : [5.7600, 4.3200, 1.4400, -0.0000, -0.0000, -3.3600, -4.3200, -4.3200, -0.0000, -0.0000]
});
PRESETS.push({
    name : 'Full Bass',
    gains : [4.8000, 5.7600, 5.7600, 3.3600, 0.9600, -2.4000, -4.8000, -6.2400, -6.7200, -6.7200]
});
PRESETS.push({
    name : 'Full Bass & Treble',
    gains : [4.3200, 3.3600, -0.0000, -4.3200, -2.8800, 0.9600, 4.8000, 6.7200, 7.2000, 7.2000]
});
PRESETS.push({
    name : 'Full Treble',
    gains : [-5.7600, -5.7600, -5.7600, -2.4000, 1.4400, 6.7200, 9.6000, 9.6000, 9.6000, 10.0800]
});
PRESETS.push({
    name : 'Laptop Speakers / Headphones',
    gains : [2.8800, 6.7200, 3.3600, -1.9200, -1.4400, 0.9600, 2.8800, 5.7600, 7.6800, 8.6400]
});
PRESETS.push({
    name : 'Large Hall',
    gains : [6.2400, 6.2400, 3.3600, 3.3600, -0.0000, -2.8800, -2.8800, -2.8800, -0.0000, -0.0000]
});
PRESETS.push({
    name : 'Live',
    gains : [-2.8800, -0.0000, 2.4000, 3.3600, 3.3600, 3.3600, 2.4000, 1.4400, 1.4400, 1.4400]
});
PRESETS.push({
    name : 'Party',
    gains : [4.3200, 4.3200, -0.0000, -0.0000, -0.0000, -0.0000, -0.0000, -0.0000, 4.3200, 4.3200]
});
PRESETS.push({
    name : 'Pop',
    gains : [-0.9600, 2.8800, 4.3200, 4.8000, 3.3600, -0.0000, -1.4400, -1.4400, -0.9600, -0.9600]
});
PRESETS.push({
    name : 'Reggae',
    gains : [-0.0000, -0.0000, -0.0000, -3.3600, -0.0000, 3.8400, 3.8400, -0.0000, -0.0000, -0.0000]
});
PRESETS.push({
    name : 'Rock',
    gains : [4.8000, 2.8800, -3.3600, -4.8000, -1.9200, 2.4000, 5.2800, 6.7200, 6.7200, 6.7200]
});
PRESETS.push({
    name : 'Ska',
    gains : [-1.4400, -2.8800, -2.4000, -0.0000, 2.4000, 3.3600, 5.2800, 5.7600, 6.7200, 5.7600]
});
PRESETS.push({
    name : 'Soft',
    gains : [2.8800, 0.9600, -0.0000, -1.4400, -0.0000, 2.4000, 4.8000, 5.7600, 6.7200, 7.2000]
});
PRESETS.push({
    name : 'Soft rock',
    gains : [2.4000, 2.4000, 1.4400, -0.0000, -2.4000, -3.3600, -1.9200, -0.0000, 1.4400, 5.2800]
});
PRESETS.push({
    name : 'Techno',
    gains : [4.8000, 3.3600, -0.0000, -3.3600, -2.8800, -0.0000, 4.8000, 5.7600, 5.7600, 5.2800]
});
