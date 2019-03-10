<template>
    <view class="navigation-bar-container" :class="{ black, transparent }">
        <view class="status-bar" v-if="black" ></view>
        <view class="status-bar status-bar-2" v-else></view>
        <view class="navigation-bar">
            <view class="left" @click="navigateBack" v-if="back">
                <!--<i class="uni-btn-icon" style="font-size: 27px;"></i>-->
                <image class="back" v-if="black" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAC/UlEQVR4Xu2bTWsTURSGnzMz6UZ3fiAKQv1AaMGF2jbYbtJFu3MpGlTwP2ihu+LGRdpf4E6kCwXrxiqiFEGhUdCN4ELBT5Rq3bhRGjNHRjo0hhiCmZl7M7eB7HKHnOd9773nnjlXcPwjjsfPJoBNB/QIgaWlmWDL5x+HQtVRT3QgVBFEvxXLlUvdhNAzU+Dx1Qs7gwJDqlISGBTwQ1gplitncw8gCr7ge2N4OqnKKLAb8ATeD5crh3MNIFZekBOKjqNyYD3gj8CrkXJlPLcAYuVVdAKkBLof8IEo+HsqvCyerszmEsBfyisl4CCgKB9E9AGwIB5vhk7NvsgdgBbK7wMC4B1wV9DbtV9U1+pbv5fOz/zMFYB2yiPcJ2Sh0BdUj5y8/LWbwOOxVm2DnSo/em72SxLBR8+wBkDWylvlABPKWwPAlPJWADCpvHEAppU3CsAG5Y0BsEV5IwBsUj5zALYpnymAtsord0R0Mcrtk8zwOs0UU88EbVU+Ewd0onwQFJaTOth0qnrj71JzgO3Kp+qAXlA+NQDPrk/vqNVrw39qeE2VnDTO8/9j+1SmgCry/Mb09lq9NobK5HoNb6OSs77am57zzcASWwOWr00VPS/cq+JNoHociKq3a8An4CGitwp+4YnJBa+VWxIDUJ2fmgPtRzmKsAvoQ/R1VMOLvr5q9Vh5brVbyyY9PkEAF58C/cC2jT+pj1C54ku4aGPwiZbEqvPOA3B8Cji/CDq/DcYLn7OJUOP25HQqHINw+jDUCCFqbGh4vW1dapxYIvSvDM12J6QOIAJj85qQCYAYQtTkZNsxOTMAtjohUwA2OiFzALY5wQgAm5xgDIAtTjAKwAYnGAdg2glWADDpBGsAmHKCVQBMOME6AJ06Ibetsp3UE6JmaQ3lphfo21w2S7epJ7jTLt/SCa5dmGh2QsOVmT1Rn7MTV2aanYB64xAOKuILrIyUK2e6eV9o5S7QKqD42pxSH1P1BkRUFFaduTbXjcrtxvaMAzYBpETAeQf8BuoU1l8Kdi/YAAAAAElFTkSuQmCC"></image>
                <image class="back" v-else src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAC3ElEQVR4Xu2bz2oTURTGv28m+AL+QRQknYwILbiRitgs0i7qzifQl3GtT+A7qBtrEbsQXBjdCkLMTKIGQa0bVyJkjtySkWFI25DMzD2Zm1mG3JDz+7577rln7iUcf+h4/FgBWDlgSQh0Op3GaDS6JiJbIrIuIiT5K47jB4uEsDRToNVqXRCRTZLbSZJskPQBfI/j+H7tAUyCb4vIHZJbAC4B8AB8ieP4eq0BpMqLyF2SOwDCScAjAJ/iODafzf2ongKp8gB2AWwDaAEw1jfBvxSRj4PB4OHc0QN6l8Gc8ib4qwAEwFcAByLy1PO8QRRFH2oHYIryAYAGgM8A9kXkued53fF4/Hs4HP6pFYBTlH8FwCjf7ff7PxcJPB2rKgfMqnwURT+KCN78hhoAVSuvygE2lFcDwJbyKgDYVN46ANvKWwWgQXlrALQobwWAJuUrB6BN+UoBnKL8CxHZM+VtkRXerJVi6ZWgVuUrccAsyvu+/7aojc2sqme/V5oDtCtfqgOWQfnSAIRheD5JkpuTHl6+k1P4fn4e25c1BRiG4TkROereTnp42U7OUba3PefzwArLAc1m8xbJKyR3Sd4WEdO9/QvgG8nXIvLM87x3NhPeNLcUBiAIgkcA1gDcAHARwBkAfZKmh7ffaDS6vV7vcFHLFj2+SADvRWSN5NnMn3xD8rHv+3sagy+0JRYEgfMA3J4CzidB02F2ehlME5/LhdD/5O90KZxScHozlIPQzrzeVlcaF1YIHVehaXdC6QAMGM05oRIAGQib2rbJlQHQ6oRKAWh0QuUAtDnBCgBNTrAGQIsTrALQ4ATrAGw7QQUAm05QA8CWE1QBsOEEdQBmdUJtj8rO2E84APCE5LCWh6VP6Ce4c1z+GCe4dWEi74TMlZnLk3PO9b8yk3cCgB2SGyKSXpq6t8j7QpWrwLSAMtfm2kmSrBsHkDx05trcIiqfNHZpHLACUBIB5x3wD+gEGm4rwECSAAAAAElFTkSuQmCC"></image>
            </view>

            <view class="title">{{ title }}</view>
            <view class="right">
                <slot></slot>
            </view>
        </view>

        <view class="navigation-bar-placeholder"></view>
    </view>
</template>

<script>
    export default {
        name: "NavigationBar",

        props: {
            title: String,
            back: {
                type: Boolean,
                default: true,
            },
            black: Boolean,
            transparent: Boolean,
            customLeft: Boolean,
        },

        methods: {
            navigateBack () {
                if (this.customLeft) {
                    this.$emit('back');
                } else {
                    uni.navigateBack();
                }
            }
        },

    }
</script>

<style scoped lang="less">

    .navigation-bar-placeholder {
        height: 88upx;
    }

    .navigation-bar {
        position: fixed;
        left: 0;
        width: 100%;
        height: 88upx;
        padding: 24upx 30upx;
        display: flex;
        overflow: hidden;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        z-index: 998;
        color: #222222;
        background-color: #fff;
        transition-property: all;
        border-bottom: 1upx solid #EBEBEB;

        .left {
            display: flex;
            align-items: center;
            font-size: 32upx;
            width: 88upx;
            height: 88upx;
            padding-left: 24upx;
            margin-left: -24upx;

            .back {
                width: 32upx;
                height: 32upx;
            }
        }
        .title {
            position: absolute;
            left: 70upx;
            right: 70upx;
            min-width: 0;
            -webkit-user-select: auto;
            user-select: auto;
            text-align: center;
            font-size:36upx;
            color:rgba(34,34,34,1);
        }
        .right {
            font-size:28upx;
            color: #C9A675;
            padding-right: 24upx;
            margin-right: -24upx;
            min-width: 88upx;
            height: 88upx;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            z-index: 9;

            &:active {
                color: #e7c18e;
            }
        }
    }

    .status-bar {
        position: fixed;
        top: 0;
        width: 100%;
        height: var(--status-bar-height);
        background:rgba(34,34,34,1);
        z-index: 998;
    }

    .status-bar-2 {
        background: #ffffff;
    }

    .navigation-bar-container.black {
        padding-top: var(--status-bar-height);
    }
    .black {
        .navigation-bar {
            border-bottom: none;
            background:rgba(34,34,34,1);
        }
        .title {
            color: #C9A675;
        }
        .navigation-bar-placeholder {
            height: 88upx;
            padding-top: var(--status-bar-height);
        }
    }

    .transparent {
        .navigation-bar {
            background-color: transparent;
        }
        .status-bar {
            background: transparent;
        }
    }

    .uni-btn-icon {
        color: #222222;
    }
    .black {
        .uni-btn-icon {
            color: #C9A675;

        }
    }

</style>