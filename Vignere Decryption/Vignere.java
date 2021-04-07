import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.DecimalFormat;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;


public class Vignere {
   public static void main(String[] args) throws IOException {

      String cipherFile = args[0];
      divideCipher(cipherFile, 3);

      BufferedReader fl = new BufferedReader(new FileReader(cipherFile));
      StringBuilder line = new StringBuilder();
      line.append(fl.readLine());
      fl.close();

      // loop through the trigrams
      BufferedReader cipherReader = new BufferedReader(new FileReader("c1freq.txt"));
      int index = 0;
      String chunk = "";
      Map<String, List<Integer>> counts = new HashMap<String, List<Integer>>();
      while ((chunk = cipherReader.readLine()) != null) {
         chunk = chunk.substring(0, 3);
         counts.put(chunk, new ArrayList<Integer>());

         for (int i = line.indexOf(chunk, 0); (i < line.length()) && (i != -1);) {

            if ((index = line.indexOf(chunk, i + 3)) != -1) {
               counts.get(chunk).add(index - i);
               i = index;
            } else {
               break;
            }
         }
      }
      cipherReader.close();

      Map<Integer, Integer> keyLen = new HashMap<Integer, Integer>();
      for (int i = 2; i < 25; i++) {
         keyLen.put(i, 0);
         for (Entry<String, List<Integer>> e : counts.entrySet()) {
            List<Integer> data = e.getValue();
            for (Integer num : data) {
               if (num % i == 0) {
                  keyLen.replace(i, keyLen.get(i), keyLen.get(i) + 1);
               }
            }

         }
      }

      // System.out.println(counts);
      // System.out.println(keyLen);
      int len = getKeyLen(keyLen);
      // System.out.println(len);
      // System.out.println(line);


      divideCipher(cipherFile,len);
      // Map<String, Double> expected = new HashMap<String,Double>();
      // expected = getExpected(line.length());
      // System.out.println(expected);

      Map<Integer, String> groups = new HashMap<Integer,String>();
      groups = getGroupByIndex(len, "divide.txt");
      // System.out.println(groups);
      // char s = 'a';
      // System.out.println((char) (s+1));
      Map<String, Double> expected = new HashMap<String,Double>();
      StringBuilder keyword = new StringBuilder();
      DecimalFormat df = new DecimalFormat("#.0000");
      expected = getExpected();

      for (int i = 0 ; i < len; i++){
         Map<String, Double> g = new HashMap<String,Double>();

         for (Entry<String, Double> e : expected.entrySet()){
            // System.out.println(e.getKey().toLowerCase().charAt(0));

            double num = Double.parseDouble(df.format(getOcurrence(e.getKey().toLowerCase().charAt(0), groups.get(i))));
            double res = Double.parseDouble(df.format((num/groups.get(i).length())*100));
            g.put(e.getKey(),res);
            // System.out.println(res);
         }
         // System.out.println("Key index :" + i);
         // System.out.println(expected);
         // System.out.println(g);
         // System.out.println('\n');
         keyword.append(getLetterKey(g));
         // System.out.println(getLetterKey(g));
      }
      // System.out.println(keyword);
      for (Entry<Integer, String> e : groups.entrySet()){
         groups.replace(e.getKey(), decrypt(keyword.charAt(e.getKey()), e.getValue()));
      }

      // System.out.println(groups);
   
      String plainText = mergeGroups(groups, len);
      // System.out.println(plainText);

      PrintWriter w = new PrintWriter("keyword1.txt");
      w.print("");
      w.close();
      w = new PrintWriter("message1.txt");
      w.print("");
      w.close();

      w = new PrintWriter("keyword1.txt");
      w.print(keyword);
      w.close();
      w = new PrintWriter("message1.txt");
      w.print(plainText);
      w.close();



   }

   private static String mergeGroups(Map<Integer, String> groups, int keywordLen) {
      StringBuilder plainText = new StringBuilder();
      for (int i = 0; i < groups.get(0).length(); i++) {
         for (int j = 0; j < groups.size(); j++) {
            if (i > groups.get(j).length()) {
               break;
            }
            plainText.append(groups.get(j).charAt(i));

         }


      }

      return plainText.toString();
   }

   private static String decrypt(char key, String str) {
      // System.out.println(str);
      StringBuilder res = new StringBuilder();
      for (int i = 0; i < str.length(); i++) {
         char c = key;
         int dist = (str.charAt(i) - key);
         
         if (dist < 0) {

            // dist = (-1) * dist;
            c = (char) (((122 - key) + (str.charAt(i) - 96)) + 97);
         } else {
            c = (char) (dist + 97);
         }

         res.append(c);
      }
      return res.toString();

   }

   private static char getLetterKey(Map<String, Double> table){
      Character c = null;

      for(Entry<String, Double> e : table.entrySet()){
         c = e.getKey().charAt(0);
         Character t = c;
         double cValue = e.getValue();

         double[] val = new double[8];
         for (int i = 0; i < 8 ; i++) {
            t++;
            if (t > 122) {
               t = (char) 97;

            }
            val[i] = table.get(t.toString());
         }

         /**
          * cValue > val[0] & val[1] & va[2]
          * val[3] > val[0] & val[1] & va[2] & val[4] & val[5] & val[6]
          * val[7] > val[4] & val[5] & val[6]
          */
         if ((cValue > val[0]) && (cValue > val[1]) && (cValue > val[2]) && (val[3]> val[0]) && (val[3]> val[1]) && (val[3]> val[2]) && 
                  (val[3]> val[4]) && (val[3]> val[5]) && (val[3]> val[7]) && (val[7] > val[4]) && (val[7] > val[4]) && (val[7] > val[4])) {
                     break;
                  }

      }
      return c;
   }

   private static Map<Integer,String> getGroupByIndex(int length, String filename) throws IOException {
      BufferedReader fr = new BufferedReader(new FileReader(filename));
      Map<Integer, String> res = new HashMap<Integer, String>();
      String chunk = "";

      for(int i=0 ; i<length;i++){
         res.put(i,"");
      }

      while ((chunk = fr.readLine()) != null) {
         for (int i = 0; i < length; i++) {
            res.replace(i, res.get(i) + (chunk.substring(i, i + 1)));
         }
      }
      fr.close();
      return res;
   }

   private static int getKeyLen(Map<Integer, Integer> data) {
      int len = 0;
      int max = 0;

      for (Entry<Integer, Integer> e : data.entrySet()) {
         if (max < e.getValue()) {
            max = e.getValue();
            len = e.getKey();
         }
      }
      return len;

   }

   private static  int getOcurrence(char ch, String group) {

      int res = 0;
      for (int i = 0 ; i <  group.length(); i++){
         if (ch == group.charAt(i)) {
            res++;
         }
      }
      return res;
   }

   private static Map<String, Double> getExpected() throws IOException {
      Map<String,Double> expected = new HashMap<String,Double>();
      
      BufferedReader fl = new BufferedReader(new FileReader("englishfreq.txt"));
      String line = new String();

      DecimalFormat df = new DecimalFormat("#.0000");

      while((line = fl.readLine()) != null) {
         double freq = Double.parseDouble(line.substring(2, line.length()));
         expected.put(line.substring(0,1).toLowerCase(), Double.parseDouble(df.format(freq)));
      }
      fl.close();

         return expected;
      }

   private static void divideCipher(String file, int len) throws IOException {
      File f = new File(file); // Creation of File Descriptor for input file
      FileReader fr = new FileReader(f); // Creation of File Reader object
      BufferedReader br = new BufferedReader(fr); // Creation of BufferedReader object
      int c = 0;
      String chunk = "";

      int counter = 0;

      // file writer
      FileWriter w = new FileWriter("divide.txt");

      // devide by length and write to file
      while ((c = br.read()) != -1) // Read char by Char
      {
         chunk += (char) c; // converting integer to char
         counter++;
         if (counter % len == 0) {
            w.write(chunk + "\n"); // Display the Character
            chunk = "";

         }
      }
      w.close(); // close writer
      br.close();
   }
}