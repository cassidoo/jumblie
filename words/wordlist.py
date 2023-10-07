import json
from typing import List
import random


def read_words(filename: str) -> str:
    with open(filename, 'r') as file:
        return file.read().splitlines()


def create_game_data() -> List[List[str]]:
    words_4: str = read_words('4words.txt')
    words_5: str = read_words('5words.txt')
    words_6: str = read_words('6words.txt')
    words_7: str = read_words('7words.txt')

    game_data: List[List[str]] = []

    for _ in range(min(len(words_4), len(words_5), len(words_6), len(words_7))):
        game_data.append([
            random.choice(words_4),
            random.choice(words_5),
            random.choice(words_6),
            random.choice(words_7)
        ])

    return game_data


def write_json(data: str, filename: str) -> None:
    with open(filename, 'w') as file:
        json.dump(data, file, indent=4)


def main() -> None:
    game_data: List[List[str]] = create_game_data()
    write_json(game_data, 'wordlist.json')


if __name__ == '__main__':
    main()
