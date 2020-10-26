$.namespace('mmyorder.cancelInfo');
mmyorder.cancelInfo = {
        popClose : function(goodsAll){
            
            if(goodsAll == 'N') common.link.moveOrderList();
            
            common.popLayerClose('LAYERPOP01');
        }
};