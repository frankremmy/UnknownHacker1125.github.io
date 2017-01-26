'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// Utility functions
///////////////////////
var utils = {
  randomInt: function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

// Game constants
///////////////////////
var lastDungeon = 4;
var weapons = [{ name: 'Fists', attack: [0, 2] }, { name: 'Mallet', attack: [1, 5] }, { name: 'Sword', attack: [5, 10] }, { name: 'Axe of doom', attack: [10, 20] }];

var xpForLevel = [null, 40, 120, 240, 400, 600, 840, 1120];

// Dungeon generation
///////////////////////
function roomsIntersect(room, list) {
  return list.some(function (check) {
    return !(room.x + room.w < check.x || room.x > check.x + check.w || room.y + room.h < check.y || room.y > check.y + check.h);
  });
}

function generateRooms(mapSize) {
  var rooms = [];
  var roomCount = utils.randomInt(12, 15);
  var minSize = 4;
  var maxSize = 12;

  for (var i = 0; rooms.length < roomCount && i < 2000; i++) {
    var room = {};

    room.w = utils.randomInt(minSize, maxSize);
    room.h = utils.randomInt(minSize, maxSize);
    room.x = utils.randomInt(1, mapSize - room.w - 1);
    room.y = utils.randomInt(1, mapSize - room.h - 1);

    // set the coordinates of the center of the room
    // used for connecting rooms
    room.centerX = room.x + room.w / 2;
    room.centerY = room.y + room.h / 2;

    if (roomsIntersect(room, rooms)) {
      continue;
    }

    rooms.push(room);
  }
  return rooms;
};

function isInRoom(tile, rooms) {
  return rooms.some(function (check) {
    return tile.x >= check.x && tile.x < check.x + check.w && tile.y >= check.y && tile.y < check.y + check.h;
  });
}

function findNeighbor(room, rooms) {
  var neighbor = undefined;
  var minDistance = 10000;

  for (var i = 0; i < rooms.length; i++) {
    var check = rooms[i];
    if (check == room) {
      continue;
    }

    // this is somewhat hacky but it works. It is designed to increase the
    // likelihood of connecting all the rooms without implementing a more
    // complex algorithm
    var distanceX = Math.min(Math.abs(room.x + room.w - check.x + check.w), Math.abs(room.x - room.w - check.x - check.w));
    var distanceY = Math.min(Math.abs(room.y + room.h - check.y + check.h), Math.abs(room.y - room.h - check.y - check.h));
    var distance = distanceX + distanceY;

    if (distance < minDistance) {
      minDistance = distance;
      neighbor = check;
    }
  }
  return neighbor;
}

// draw the corridors
function connectRooms(rooms, map, mapSize) {
  rooms.forEach(function (roomA) {
    var roomB = findNeighbor(roomA, rooms);
    var pointA = {
      x: utils.randomInt(roomA.x, roomA.x + roomA.w - 1),
      y: utils.randomInt(roomA.y, roomA.y + roomA.h - 1)
    };
    var pointB = {
      x: utils.randomInt(roomB.x, roomB.x + roomB.w - 1),
      y: utils.randomInt(roomB.y, roomB.y + roomB.h - 1)
    };

    while (pointB.x != pointA.x || pointB.y != pointA.y) {
      if (pointB.x != pointA.x) {
        if (pointB.x > pointA.x) pointB.x--;else pointB.x++;
      } else if (pointB.y != pointA.y) {
        if (pointB.y > pointA.y) pointB.y--;else pointB.y++;
      }

      map[pointB.x + pointB.y * mapSize].floor = true;
    }
  });
}

function createTiles(rooms, mapSize) {
  var map = [];
  for (var i = 0; i < mapSize * mapSize; i++) {
    var tile = {
      floor: false,
      hasObject: false,
      x: i % mapSize,
      y: Math.floor(i / mapSize)
    };

    if (isInRoom(tile, rooms)) {
      tile.floor = true;
    }
    map.push(tile);
  }
  return map;
}

// generate the rooms and corridors in a square map
// returns an array of tiles to be rendered by the react component
function generateDungeon(mapSize, dungeonNumber) {
  var rooms = generateRooms(mapSize);
  var map = createTiles(rooms, mapSize);
  connectRooms(rooms, map, mapSize);

  var objCount = utils.randomInt(4, 6);
  placeObjectsOfType('potion', map, objCount);
  if (dungeonNumber !== lastDungeon) {
    placeObjectsOfType('door', map);
    placeWeapon(map);
  }

  return map;
}

function findValidPosition(tiles) {
  var invalid = true;
  var idx = undefined;
  var possible = undefined;
  while (invalid) {
    idx = utils.randomInt(0, tiles.length - 1);
    possible = tiles[idx].floor && tiles[idx].hasObject !== 'door';
    invalid = possible ? false : true;
  }
  return idx;
}

function placeObjectsOfType(type, tiles) {
  var count = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

  // let objCount = utils.randomInt(4, 6);
  var indices = [];
  for (var i = 0; i < count; i++) {
    var idx = findValidPosition(tiles);
    tiles[idx].hasObject = type;
    indices.push(idx);
  }
  return indices;
}

function placeEnemies(tiles, num, level) {
  var type = arguments.length <= 3 || arguments[3] === undefined ? 'enemy' : arguments[3];

  var indices = placeObjectsOfType(type, tiles, num);
  if (type === 'boss') {
    var _ref;

    return _ref = {}, _ref[indices] = { hp: 250, dmg: 40 }, _ref;
  }
  return indices.reduce(function (prev, idx) {
    prev[idx] = { hp: 4 * level, dmg: 4 * level };
    return prev;
  }, {});
}

function placePlayer(tiles) {
  var idx = findValidPosition(tiles);
  return idx;
}

function placeWeapon(tiles) {
  var idx = findValidPosition(tiles);
  tiles[idx].hasObject = 'weapon';
  return idx;
}

// React components
///////////////////////
var Map = function Map(props) {
  function getClassName(tile, idx) {
    if (props.player.idx === idx) {
      return 'player';
    }
    if (tile.hasObject) {
      return tile.hasObject;
    }
    return tile.floor ? 'floor' : 'wall';
  };

  function isLighted(tile) {
    if (tile.visited) {
      return tile.visited;
    }
    var condition = Math.abs(props.player.x - tile.x) + Math.abs(props.player.y - tile.y) <= 5 && Math.abs(props.player.x - tile.x) < 4 && Math.abs(props.player.y - tile.y) < 4;
    tile.visited = condition;
    return condition;
  }

  function getScroll(player) {
    var dx = 0;
    var dy = 0;
    if (player.y > 9) {
      dy = -(player.y - 10) * 30;
      if (player.y > 20) {
        dy = -10 * 30;
      }
    }
    // if (player.x > 9) {
    //   dx = -(player.x - 10) * 30;
    //   if (player.x > 20) {
    //     dx = -10 * 30
    //   }
    // }
    return { transform: 'translate3d(' + dx + 'px, ' + dy + 'px, 0px)' };
  }

  return React.createElement(
    'div',
    { className: 'map', style: getScroll(props.player) },
    props.tiles.map(function (tile, i) {
      return React.createElement('div', {
        className: getClassName(tile, i),
        style: { opacity: isLighted(tile) ? 1 : 0 }
      });
    })
  );
};

var Meter = function Meter(props) {
  var measure = props.measure;

  return React.createElement(
    'div',
    { className: 'meter',
      style: {
        display: 'inline-block',
        position: 'relative',
        textAlign: 'center',
        border: '1px solid white',
        margin: '0 5px',
        width: 100
      }
    },
    'HP ' + measure,
    React.createElement('div', {
      className: 'meter--inner',
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: measure + '%',
        height: '100%',
        backgroundColor: 'green',
        transition: 'width 200ms ease',
        zIndex: -1
      }
    })
  );
};

var Display = function Display(props) {
  var xp = props.xp;
  var hp = props.hp;
  var level = props.level;
  var weapon = props.weapon;
  var dungeon = props.dungeon;

  return React.createElement(
    'div',
    { className: 'stats' },
    React.createElement(
      'span',
      { className: 'stat' },
      'XP: ',
      xp
    ),
    React.createElement(
      'span',
      { className: 'stat' },
      'level: ',
      level
    ),
    React.createElement(Meter, { measure: hp }),
    React.createElement(
      'span',
      { className: 'stat' },
      'Weapon: ',
      weapons[weapon].name
    ),
    React.createElement(
      'span',
      { className: 'stat' },
      'Dungeon: ',
      dungeon
    )
  );
};

var Message = function Message(props) {
  var message = 'You win!';
  var event = props.event;
  var reset = props.reset;

  if (event === 'death') {
    message = 'You lose';
  }
  return React.createElement(
    'div',
    { className: event ? 'message--open' : 'message--closed' },
    React.createElement(
      'h2',
      { className: 'message--title' },
      message
    ),
    React.createElement(
      'button',
      { type: 'button', onClick: reset },
      'Play again'
    )
  );
};

var Game = React.createClass({
  displayName: 'Game',
  getInitialState: function getInitialState() {
    return this.initialSetup();
  },
  componentDidMount: function componentDidMount() {
    // document.body.addEventListener('keypress', this.handleKeydown);
    window.addEventListener('keydown', this.handleKeydown);
  },
  componentWillUnmount: function componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
  },
  initialSetup: function initialSetup() {
    var mapSize = 30;
    var gameLevel = this.createGameLevel(mapSize, 1);
    var idx = gameLevel.idx;

    return {
      mapSize: mapSize,
      tiles: gameLevel.tiles,
      enemies: gameLevel.enemies,
      dungeon: 1,
      event: false,
      player: {
        idx: idx,
        x: idx % mapSize,
        y: Math.floor(idx / mapSize),
        level: 1,
        hp: 100,
        xp: 0,
        weapon: 0
      }
    };
  },
  resetGame: function resetGame() {
    var state = this.initialSetup();
    this.setState(state);
  },
  createGameLevel: function createGameLevel(mapSize) {
    var dungeonNumber = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

    var factor = dungeonNumber / 2 + 0.5;
    var numberOfEnemies = Math.floor(factor * utils.randomInt(4, 6));
    var tiles = generateDungeon(mapSize, dungeonNumber);
    var enemies = placeEnemies(tiles, numberOfEnemies, dungeonNumber);
    if (dungeonNumber === lastDungeon) {
      var boss = placeEnemies(tiles, 1, dungeonNumber, 'boss');
      for (var index in boss) {
        enemies[index] = boss[index];
      }
    }
    var idx = placePlayer(tiles);
    return { tiles: tiles, enemies: enemies, idx: idx };
  },
  newDungeon: function newDungeon() {
    var mapSize = 30;
    var gameLevel = this.createGameLevel(mapSize, ++this.state.dungeon);
    var idx = gameLevel.idx;
    var tiles = gameLevel.tiles;
    var enemies = gameLevel.enemies;

    var newPlayerState = Object.assign({}, this.state.player, {
      idx: idx,
      x: idx % mapSize,
      y: Math.floor(idx / mapSize)
    });
    this.setState({
      tiles: tiles,
      enemies: enemies,
      player: newPlayerState
    });
  },
  fight: function fight(idx) {
    var _state$player = this.state.player;
    var hp = _state$player.hp;
    var level = _state$player.level;
    var weapon = _state$player.weapon;

    console.log('level', level);
    var _weapons$weapon$attac = weapons[weapon].attack;
    var minAttack = _weapons$weapon$attac[0];
    var maxAttack = _weapons$weapon$attac[1];

    var enemy = this.state.enemies[idx];

    hp -= utils.randomInt(0, enemy.dmg);

    enemy.hp -= utils.randomInt(minAttack, maxAttack) + level;
    console.log('results', { enemyHP: enemy.hp, playerHP: hp });
    return { enemyHP: enemy.hp, playerHP: hp };
  },
  movePlayer: function movePlayer(newPos, oldPos) {
    var _state = this.state;
    var mapSize = _state.mapSize;
    var tiles = _state.tiles;
    var player = _state.player;
    var hp = player.hp;
    var xp = player.xp;
    var weapon = player.weapon;
    var level = player.level;

    var oldIdx = oldPos.x + oldPos.y * mapSize;
    var idx = newPos.x + newPos.y * mapSize;
    var blocked = false;
    var finalFight = undefined;

    if (!tiles[idx].floor) {
      return;
    }
    switch (tiles[idx].hasObject) {
      case 'boss':
        finalFight = true;
      case 'enemy':
        var _fight = this.fight(idx);

        var enemyHP = _fight.enemyHP;
        var playerHP = _fight.playerHP;

        if (playerHP <= 0) {
          this.setState({ event: 'death' });
          return;
        }
        if (enemyHP <= 0) {
          if (finalFight) {
            this.setState({ event: 'victory' });
          }
          xp += 10 * level;
        } else {
          blocked = true;
        }
        hp = playerHP;
        break;
      case 'weapon':
        weapon += 1;
        break;
      case 'potion':
        hp = Math.min(hp + 70, 100);
        break;
      case 'door':
        tiles[idx].hasObject = false;
        this.newDungeon();
        return;
    }
    if (blocked) {
      idx = oldIdx;
    } else {
      tiles[idx].hasObject = false;
    }

    var newPlayerState = Object.assign({}, player, {
      hp: hp,
      xp: xp,
      idx: idx,
      weapon: weapon,
      x: idx % mapSize,
      y: Math.floor(idx / mapSize),
      level: xp > xpForLevel[level] ? ++level : level
    });
    this.setState({ player: newPlayerState });
  },
  handleKeydown: function handleKeydown(evt) {
    evt.preventDefault();
    var newPos = {};
    var player = this.state.player;

    var oldPos = { x: player.x, y: player.y };
    switch (evt.keyCode) {
      case 37:
        // left
        newPos = { x: player.x - 1, y: player.y };
        break;
      case 38:
        // up
        newPos = { x: player.x, y: player.y - 1 };
        break;
      case 39:
        // right
        newPos = { x: player.x + 1, y: player.y };
        break;
      case 40:
        // down
        newPos = { x: player.x, y: player.y + 1 };
    }
    this.movePlayer(newPos, oldPos);
  },
  render: function render() {
    var player = this.state.player;

    return React.createElement(
      'div',
      { className: 'game' },
      React.createElement(Message, { event: this.state.event, reset: this.resetGame }),
      React.createElement(Display, _extends({}, player, { dungeon: this.state.dungeon })),
      React.createElement(
        'div',
        { style: { height: 600, width: 900, overflow: 'hidden' } },
        React.createElement(Map, { tiles: this.state.tiles, player: this.state.player })
      )
    );
  }
});

ReactDOM.render(React.createElement(Game, null), document.getElementById('root'));