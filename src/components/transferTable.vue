<template>
  <div class="">
    <v-data-table
      :headers="headers"
      :items="list"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.from_addr }}</td>
        <td class="text-xs-left">{{ $t(props.item.type) }}</td>
        <td class="text-xs-left">{{ props.item.balance }}</td>
        <td class="text-xs-left">{{ props.item.created_at }}</td>
        <td class="text-xs-left">{{ props.item.amount }}</td>
      </template>
    </v-data-table>
    <!-- <div style="max-width:600px;margin:10px auto 0 auto" class="text-xs-center">
      <v-pagination
        v-model="page"
        :length="1"
      ></v-pagination>
    </div> -->
    <p class="mt-2 pl-1 caption" style="text-align:left;color:#666">
      共{{list.length}}条记录，第1/1页
    </p>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        page: 1,
        headers: [
          {
            text: '来源',
            sortable: false,
            value: 'from_addr'
          },
          { text: '类型', value: 'type' },
          { text: '数量', value: 'balance' },
          { text: '时间', value: 'created_at' },
          { text: '金额', value: 'amount' },
        ],
        list: []
      }
    },
    mounted () {
      let vm = this
      fetch(vm.api_url+'/transfer',{
        headers:{
          'X-Auth-Token': localStorage.getItem('token')
        }
      }).then(res=>res.json()).then(data => {
        if (data==401) {
          localStorage.clear()
          location.href = '/login'
        } else {
          vm.list = data.data
          console.log(vm.list);
        }
      })
    },
  }
</script>
