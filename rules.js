const clues = [
    {
        description: "The orange fields form a filled square",
        details: "There exists an axis-aligned square such that all fields inside are orange and all fields outside are not",
        check: function () {
            const board = filter(6);
            const points = getpoints(6);
            if (points.length === 0)//check if any points exist
                return false;
            const x1 = points[0].x;//determine corners of rectangle
            const x2 = points[points.length - 1].x;
            const y1 = points[0].y;
            const y2 = points[points.length - 1].y;
            if (x2 - x1 != y2 - y1)//determine if exactly square
                return false;
            for (let i = 0; i < 6; i++) {//check for exact fit
                for (let j = 0; j < 6; j++) {
                    if (board[j][i] ^ (i >= x1 && i <= x2 && j >= y1 && j <= y2))
                        return false;
                }
            }
            return true;
        }
    },
    {
        description: "The red fields form a filled rectangle",
        details: "There exists an axis-aligned rectangle such that all fields inside are red and all fields outside are not",
        check: function () {
            const board = filter(5);
            const points = getpoints(5);
            if (points.length === 0)
                return false;
            const x1 = points[0].x;
            const x2 = points[points.length - 1].x;
            const y1 = points[0].y;
            const y2 = points[points.length - 1].y;
            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 6; j++) {
                    if (board[j][i] ^ (i >= x1 && i <= x2 && j >= y1 && j <= y2))
                        return false;
                }
            }
            return true;
        }
    }, {
        description: "The blue fields are connected by knights moves",
        details: "A knight can travel to every blue field AT LEAST once without touching a non-blue field",
        check: function () {
            let targets = getpoints(1);
            if (targets.length === 0)
                return true;
            const visited = [targets.shift()];
            for (let i = 0; i < visited.length; i++) {
                let filtered = [];
                for (let tile of targets) {
                    if ((Math.abs(tile.x - visited[i].x) === 2 && Math.abs(tile.y - visited[i].y) === 1) ||
                        (Math.abs(tile.x - visited[i].x) === 1 && Math.abs(tile.y - visited[i].y) === 2)
                    ) {
                        visited.push(tile);
                    } else {
                        filtered.push(tile);
                    }
                }
                targets = filtered;
            }
            return targets.length === 0;
        }
    }, {
        description: "Every green field borders a blue field",
        details: "For every green field, there is at least one blue field orthogonally adjacent",
        check: function () {
            const points = getpoints(3);
            const blues = filter(1);
            return points.every((p) =>
                (p.x >= 1 && blues[p.y][p.x - 1]) ||
                (p.y >= 1 && blues[p.y - 1][p.x]) ||
                (p.x <= 4 && blues[p.y][p.x + 1]) ||
                (p.x <= 4 && blues[p.y + 1][p.x])
            );
        }
    }, {
        description: "No purple field is alone on it's down-right diagonal",
        details: "No diagonal running from top-left to bottom-right contains exactly 1 purple field",
        check: function () {
            const points = getpoints(2);
            for (let i = -5; i <= 5; i++) {
                if (points.filter((p) => (p.x - p.y === i)).length === 1)
                    return false;
            }
            return true;
        }
    }, {
        description: "No cold color repeats in a row or column",
        details: "Blue, purple, green, and turquoise each appear at most once in each row and column",
        check: function () {
            for (let i = 1; i <= 4; i++) {
                const points = getpoints(i);
                const hash = {};
                for (let p of points) {
                    if (hash["x" + p.x] || hash["y" + p.y]) {
                        return false;
                    } else {
                        hash["x" + p.x] = hash["y" + p.y] = true;
                    }
                }
            }
            return true;
        }
    }, {
        description: "The colored fields form a single region",
        details: "The fields that have a color form a single orthogonally connected region",
        check: function () {
            let targets = tiles.flat().filter((tile) => tile.color);
            if (targets.length === 0)
                return true;
            const visited = [targets.shift()];
            for (let i = 0; i < visited.length; i++) {
                let filtered = [];
                for (let tile of targets) {
                    if ((Math.abs(tile.x - visited[i].x) === 1 && tile.y === visited[i].y) ||
                        (tile.x === visited[i].x && Math.abs(tile.y - visited[i].y) === 1)
                    ) {
                        visited.push(tile);
                    } else {
                        filtered.push(tile);
                    }
                }
                targets = filtered;
            }
            return targets.length === 0;
        }
    }, {
        description: "Exactly odd columns have an odd number of colored fields",
        details: "Every odd column has an odd number of colored fields and every even row does not (indexing starts at 1)",
        check: function () {
            const points = getpoints(0);
            for (let i = 0; i < 6; i++)
                if (points.filter((p) => p.x === i).length % 2 != (i + 1) % 2)
                    return false;
            return true;
        }
    }, {
        description: "Every uncolored field borders another one vertically",
        details: "For every uncolored field either the one above, the one below, or both are also uncolored",
        check: function () {
            const points = getpoints(0);
            const blanks = filter(0);
            return points.every((p) => (p.y >= 1 && blanks[p.y - 1][p.x]) || (p.y <= 4 && blanks[p.y + 1][p.x]));
        }
    }, {
        description: "Every uncolored field is horizontally two space away from another one",
        details: "For every uncolored field either 2 spaces (1 field in between) to the left, 2 spaces to the right, or both are also uncolored",
        check: function () {
            const points = getpoints(0);
            const blanks = filter(0);
            return points.every((p) => blanks[p.y][p.x - 2] || blanks[p.y][p.x + 2]);
        }
    }, {
        description: "A row contains an even non-0 number of uncolored fields",
        details: "At least one row has an even number of uncolored fields other than 0",
        check: function () {
            const blanks = filter(0);
            return blanks.some((row) => { let num = row.filter((x) => x).length; return num != 0 && num % 2 == 0 });
        }
    }, {
        description: "At most 2 fields are turquoise",
        details: "Less than or equal to 2 fields are turquoise",
        check: function () {
            return getpoints(4).length <= 2;
        }
    }, {
        description: "At least 6 fields are blue",
        details: "Greater than or equal to 6 fields are blue",
        check: function () {
            return getpoints(1).length >= 6;
        }
    }
    // ,{
    //     description: "C5 is blue",
    //     details: "With rows numbered 1-6 top to bottom, and columns A-F left to right: C5 is blue",
    //     check: function () {
    //         return tiles[4][2].color === 1;
    //     }
    // }
    , {
        description: "A color except green contains the shape of 5 on a dice",
        details: "There exist 5 fields of the same color excluding green such that 4 are equidistant from the 5th tile and 90 degrees apart",
        check: function () {
            for (let i of [1, 2, 4, 5, 6]) {
                const points = getpoints(i);
                for (let c of points) {
                    for (let p1 of points) {
                        if (p1 !== c) {
                            const dx = p1.x - c.x;
                            const dy = p1.y - c.y;
                            if (tiles[c.y - dx] && tiles[c.y - dx][c.x + dy].color === i &&
                                tiles[c.y - dy] && tiles[c.y - dy][c.x - dx].color === i &&
                                tiles[c.y + dx] && tiles[c.y + dx][c.x - dy].color === i
                            ) {
                                return true;
                            }
                            // if (0 <= c.x + dy && c.x + dy <= 5 && 0 <= c.y - dx && c.y - dx <= 5 && tiles[c.y - dx][c.x + dy].color === i &&
                            //     0 <= c.x - dx && c.x - dx <= 5 && 0 <= c.y - dy && c.y - dy <= 5 && tiles[c.y - dy][c.x - dx].color === i &&
                            //     0 <= c.x - dy && c.x - dy <= 5 && 0 <= c.y + dx && c.y + dx <= 5 && tiles[c.y + dx][c.x - dy].color === i
                            // ) {
                            //     return true;
                            // }
                        }
                    }
                }
            }
            return false;
        }
    }
]
