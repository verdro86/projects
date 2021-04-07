Program 
- Vignere.java : decrypter

Files used
- cipher.txt : contains the cipher to be decrypted
- divide.txt : contains the cipher but divide into N keyword length
- englishfreq.txt : contains the frequency data for each alphabet in english word
- keyword.txt : contains the keyword
- message1.txt : contains the plaintext

command to run the program:
./ngrams.py cipher1.txt > c1freq.txt    // generates trigrams frequency of the ciphertext
java  Vignere.java cipher1.txt

Explanation:
- Finding length of keyword
    The program first divide the ciphertext into trigrams and save it into divide.txt
Then for each trigram, the program loop through divide.txt and determine the distance between 
each occurrence of the trigram. The program then loop through all the data of occurrence for each trigram and starting 
2 and up to 25 (which are possible length of keyword), divide the recorded distances by possible keyword 
length i. If the distance is divisible by i, then increase counter for i. It then loop through each possible length i, 
the i with the highest counter of divisibility for the data of distances yields the most likely length of the keyword.

- Find the keyword
    With the keyword length, the ciphertext is then divided by keyword length, take each letter at index i and combine 
into groups. For example: 
    wqwes
    aswfg
    scgdf
    ...
The letters at index 0,6,11.. (w,a,s,..) will be in the same group. Each group is then looped through and calculate the 
frequency of each letter. Given that each group is encrypted with the same letter, then the group's letter frequency would
somewhat follow the same pattern as the standard english letter frequency. After the frequency of letters in each group is 
calculated, the program track a pattern in the frequency data that is found in the standard english letter frequency.
Pattern:
    A frequency > b,c, & d  frequency < e frequency > g & h frequency < i frequency
So the first letter of the group that follows this pattern will be the letter of the keyword of each group.

- Decrypting the ciphertext
    use the each letter of the keyword to decrypt each group of letters from the previous operation. The corresponding letter 
of the plaintext is decrypted by calculating the offset of the ciphertext letter Ci to the keyword letter Ki. each decrypted 
groups is then merged to get the full plaintext.
