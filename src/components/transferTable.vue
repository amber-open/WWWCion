<template>
  <div class="">
    <v-data-table
      :headers="headers"
      :items="list"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <!-- <td class="text-xs-left">{{ props.item.from_addr }}</td> -->
        <td class="text-xs-left">{{ $t(props.item.type) }}</td>
        <td class="text-xs-left">{{ props.item.balance }}</td>
        <td class="text-xs-left">{{ props.item.amount }}</td>
        <td class="text-xs-left">{{ props.item.created_at }}</td>
      </template>
    </v-data-table>
    <div style="max-width:666px;margin:10px auto 0 auto" class="text-xs-center">
      <v-pagination
        v-model="page"
        :length="pl"
      ></v-pagination>
    </div>
    <p class="mt-2 mb-0 pl-1 caption" style="text-align:left;color:#666">
      共{{count}}条记录，第{{page}}/{{pl}}页
    </p>

  </div>
</template>
<script>
  import { xhr_getTransfers} from '@/api/index'
  export default {
    data () {
      return {
        page: 1,
        length: 8,
        pl: 0,
        count: 0,
        headers: [
          // {
          //   text: '来源',
          //   sortable: false,
          //   value: 'from_addr'
          // },
          { text: '类型', value: 'type' },
          { text: '数量', value: 'balance' },
          { text: '金额', value: 'amount' },
          { text: '时间', value: 'created_at' },
        ],
        list: []
      }
    },
    watch: {
      page (n, o) {
        let vm = this
        vm.getList(vm.length*(n-1),vm.length)
      }
    },
    mounted () {
      let vm = this
      let clientHeight=0;
      if (document.body.clientHeight&&document.documentElement.clientHeight) {
        clientHeight = (document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
      } else {
        clientHeight = (document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
      }
      vm.length = document.documentElement.clientWidth < 500 ? 10 : Math.floor((clientHeight-240)/48)
      vm.length = vm.length < 1 ? 10 : vm.length
      vm.getList(vm.length*(vm.page-1),vm.length)
    },
    methods: {
      getList (s,l) {
        let vm = this
        xhr_getTransfers(s,l).then(function (response) {
          vm.list = response.data.data
          vm.count = response.data.count
          vm.pl = Math.ceil(response.data.count/vm.length)
        })
      }
    }
  }
</script>
