type modData = {
    count: number;
    modType: number;
    name: string;
    num: number;
};
type primaryColor = {
    colorType: number;
    colorNum: number;
    pearl: number;
};
type secondaryColor = {
    colorType: number;
    colorNum: number;
};
type colorData = {
    primary: primaryColor;
    secondary: secondaryColor;
    xenon: number;
    window: number;
    tireSmoke: number;
};
type serverColors = {
    primary: number;
    secondary: number;
    pearl: number;
    xenon: number;
    window: number;
    tireSmoke: number;
};
type neonData = {
    color: alt.RGBA;
    enabled: boolean;
};
type plateData = {
    plateIndex: number;
    plateText: string;
};
type wheelsData = {
    type: number;
    num: number;
    color: number;
    drift: boolean;
};
