<script>
  import Sidebar from './lib/Sidebar.svelte'
  import TopBar from './lib/TopBar.svelte';
  let files = ['/home/adarsh/Downloads/code-1.75.1-1675893486.el7.x86_64.rpm']

  let getFile = () => {
  fetch('http://localhost:3000/download', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "id": 78912 })
    })
   .then(response => response.blob())
   .then(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.rpm';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
  }


</script>

<main>
  <Sidebar />
  <TopBar />
  <div class="maincontent">
    <button on:click={getFile} class="fileItem">Code.rpm</button>
    <button on:click={getFile} class="fileItem">Code.rpm</button>
    <button on:click={getFile} class="fileItem">Code.rpm</button>
    <button on:click={getFile} class="fileItem">Code.rpm</button>
  </div>

</main>

<style>
  .maincontent{
    margin-left: 150px;
    margin-top: 50px;
    display: flex;
    flex-direction: column;
  }

  .fileItem{
    margin: 0.2%;
  }

  main{
    overflow-x: hidden;
  }

</style>
