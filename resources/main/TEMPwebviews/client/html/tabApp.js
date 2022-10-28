alt.on('tabWebview:playersList', (playerList) => {
    //var playerList = ['']
    console.log(playerList)
    console.log('a')

    const html = document.querySelector('table  ')


    for (const player of playerList) {
        var tr = document.createElement('tr')
        var td = document.createElement('td')
        var h2 = document.createElement('h2')

        h2.append(player)

        td.append(h2)
        tr.append(td)
        html.append(tr)

    }

})
