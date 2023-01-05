alt.onServer("showHelpText", showHelpText);

export function showHelpText(text, sound, milliseconds) {
  native.beginTextCommandDisplayHelp("STRING");
  native.addTextComponentSubstringPlayerName(text);
  native.endTextCommandDisplayHelp(0, false, sound, milliseconds);
}

//showHelpText("Press ~INPUT_MOVE_UP_ONLY~ to move forward.", true, 5000);


export function drawText2d(
    msg,
    x,
    y,
    scale,
    fontType,
    r,
    g,
    b,
    a,
    useOutline = true,
    useDropShadow = true,
    layer = 0,
    align = 0
) {
    let hex = msg.match("{.*}");
    if (hex) {
        const rgb = hexToRgb(hex[0].replace('{', '').replace('}', ''));
        r = rgb[0];
        g = rgb[1];
        b = rgb[2];
        msg = msg.replace(hex[0], '');
    }

    native.beginTextCommandDisplayText('STRING');
    native.addTextComponentSubstringPlayerName(msg);
    native.setTextFont(fontType);
    native.setTextScale(1, scale);
    native.setTextWrap(0.0, 1.0);
    native.setTextCentre(true);
    native.setTextColour(r, g, b, a);
    native.setTextJustification(align);

    if (useOutline) {
        native.setTextOutline();
    }

    if (useDropShadow) {
        native.setTextDropShadow();
    }

    native.endTextCommandDisplayText(x, y, 0);
}

export function drawText3d(
    msg,
    x,
    y,
    z,
    scale,
    fontType,
    r,
    g,
    b,
    a,
    useOutline = true,
    useDropShadow = true,
    layer = 0
) {
    let hex = msg.match('{.*}');
    if (hex) {
        const rgb = hexToRgb(hex[0].replace('{', '').replace('}', ''));
        r = rgb[0];
        g = rgb[1];
        b = rgb[2];
        msg = msg.replace(hex[0], '');
    }

    native.setDrawOrigin(x, y, z, 0);
    native.beginTextCommandDisplayText('STRING');
    native.addTextComponentSubstringPlayerName(msg);
    native.setTextFont(fontType);
    native.setTextScale(1, scale);
    native.setTextWrap(0.0, 1.0);
    native.setTextCentre(true);
    native.setTextColour(r, g, b, a);

    if (useOutline) {
        native.setTextOutline();
    }

    if (useDropShadow) {
        native.setTextDropShadow();
    }

    native.endTextCommandDisplayText(0, 0, 0);
    native.clearDrawOrigin();
}



alt.everyTick(() => {
    //  drawText2d('Hello from Top Center of Screen', 0.5, 0.05, 0.4, 4, 255, 255, 255, 255);
});


function renderLighting() {
    const pos = alt.Player.local.pos;
    const forward = native.getEntityForwardVector(alt.Player.local.scriptID);
    const forwardVector = {
        x: pos.x + forward.x * 5,
        y: pos.y + forward.y * 5,
        z: pos.z
    };

    native.drawSpotLight(
        forwardVector.x,
        forwardVector.y,
        forwardVector.z,
        forward.x,
        forward.y,
        forward.z,
        255,
        255,
        255,
        25,
        8,
        2,
        15,
        0
    );
}

alt.everyTick(() => renderLighting())