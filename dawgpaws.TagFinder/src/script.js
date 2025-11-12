/**
 * Command to find all instances of a tag in daily notes within the current week.
 * @param {string} tag - The tag name to search for.
 */
  async function findTagInstances(tag) {
    try {
      const tag = await CommandBar.showInput("Search for tag instances", "Look for #%@", "")
      console.log('Looking for', tag);
      const currentDate = Editor.note.date;
      const startOfWeek = new Date(currentDate); 
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      const getDaysArray = function(s,e) {const a=[];for(const d=new Date(s);d<=new Date(e);d.setDate(d.getDate()+1)){ a.push(new Date(d));}return a;};
      const days = getDaysArray(startOfWeek, endOfWeek); 
      const notes = days.map((d) => DataStore.calendarNoteByDate(d, "day"));
      
      let results = [];
      for (const note of notes) {
        const content = note.content;
        const lines = content.split('\n');
        for (const line of lines) {
          if (line.includes(`#${tag}`)) {
            const formattedLine = line.replace(`- 1 #${tag} from the day:`, '')
            results.push(`- [[${note.title}]]: ${formattedLine}`);
          }
        }
      }
  
      // Output the results
      if (results.length > 0) {
        CommandBar.showLoading(true, "TagFinder");
        CommandBar.showLoading(false, `Found ${results.length} instances of #${tag} in the current week`);
        console.log(`TagFinder Results for #${tag} in the current week:`);
        results.forEach(result => console.log(result));
        const resultsText = results.join('\n');
        Editor.insertTextAtCursor(resultsText);
      } else {
        CommandBar.showLoading(false, `No instances of #${tag} found in the current week`);
      }
    } catch (error) {
      console.error("Error in findTagInstances:", error);
      CommandBar.showLoading(false, "Error occurred. Check console for details.");
    }
  }


// Register the command
// NotePlan.registerCommand("findTagInstances", findTagInstances);