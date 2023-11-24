# COMP 4021: Internet Computing Final Project

This is the final project for course COMP 4021 Internet Computing, at the Hong Kong University of Science and Technology.

## Project Details

The title of the game is _Slasher_, which is a competitive Hack and Slash 2D game, about who can slash the most entities within the time limit.

### Game Front Page

The front page is different depending on whether people are logged in or not.

#### Not Logged In

The front page will have a modal with a Login and Registration form - behind the modal you can find some sprites from the game walking around (to give the page a nice aesthetic).

Once you log in, you get to the logged in front page.

#### Logged In

When a user is logged in they will be met with a new modal where they are able to choose between the following options:

-   Join a Game (join a new session with other players)
-   Leaderboards (view the leaderboards)

### Game Play Page

The game is a Hack and Slash 2D game where players has to move around the "map" and slash as many enemies as possible within the time limit. Players move around with WASD or the arrow keys, and slash using the left mouse button.

Different points may be given for different types of enemies slashed.

A game can have the following states:

-   Searching (waiting for players to join)
-   Waiting (gives a few seconds before the game starts and lets players move)
-   Playing (players can now slash enemies)
-   GameOver (see Game Over Page section)

A game starts in the searching stage, where it will create a lobby (or join one) with other players, until said lobby fills up.

When the lobby has more than 2 players in it, it will start a countdown for which other players can get to join.

After the countdown ends, players will see the actual game, where every player is in the center of the "map". After a short while the game starts, and the players are set free.

After a set amount of time, the game stops and the game over screen is shown. The player with the most amount of kills/points win, and the rest loses.

### Game Over Page

The game over page is simply a modal which slides into the view on top of the game canvas showing the outcome of the game (winner) and other statistics. The player is then given the option to play again or go back to the main menu.

### Cheats

The following cheats are supported in the game:

-   Speed modification (increase or decrease movement speed)
-   Health modification (increase or decrease max and current health)
-   Damage modification (increase or decrease damage)
-   KillCount modificaiton (set kill count)
-   Kill (kill other players instantly)
-   Time modification (set amount of time left)
-   Range (modify attack range)

Cheats can be enabled in the Cheat Menu Modal which can be toggled using the 'å' key (yes you need a Danish keyboard layout to type that, it is part of the fun!).
