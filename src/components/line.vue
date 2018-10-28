<template>
  <div id="chartBox">
    <ve-line v-if="show" height="100%" :data="chartData" style="height:100%" :extend="extend"></ve-line>
  </div>
</template>
<script>
  import { xhr_getPriceHistory } from '@/api/index'

  import VeLine from 'v-charts/lib/line.common'
  export default {
    components: { VeLine },
    data () {
      return {
        show: false,
        extend:{
          series: {
            label: {
              normal: {
                show: true
              }
            }
          }
        },
        chartData: {
          columns: ['日期', 'WWWCoin单价'],
          rows: [
          ]
        }
      }
    },

    mounted () {
      let vm = this
      setTimeout(function(){
        vm.show = true
      },200)
      xhr_getPriceHistory().then(function (response) {

        response.data.data.forEach( (n, i) => {
          vm.chartData.rows.push({
            '日期': n.created_at,
            'WWWCoin单价': n.price
          })
        })
      })
    }
  }
</script>
<style scoped>
  #chartBox{
    padding: 20px 20px 0 20px;
    background: #fff;
    box-sizing: border-box;
    height: calc(100vh - 135px);
  }
</style>
